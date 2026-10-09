import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = relativePath => readFile(path.join(root, relativePath), "utf8");
const dataUrl = source => "data:text/javascript;base64," + Buffer.from(source).toString("base64");

const educationalSource = await read("game/educational-content.js");
const worldSource = await read("game/world-registry.js");
const dialogueSource = (await read("game/dialogue-content.js"))
  .replace('"./educational-content.js"', JSON.stringify(dataUrl(educationalSource)));
const adventureSource = (await read("game/adventure-data.js"))
  .replace('"./world-registry.js"', JSON.stringify(dataUrl(worldSource)));
const distributionSource = (await read("game/mission-distribution.js"))
  .replace('"./world-registry.js"', JSON.stringify(dataUrl(worldSource)))
  .replace('"./educational-content.js"', JSON.stringify(dataUrl(educationalSource)))
  .replace('"./dialogue-content.js"', JSON.stringify(dataUrl(dialogueSource)))
  .replace('"./adventure-data.js"', JSON.stringify(dataUrl(adventureSource)));

const [world, distribution] = await Promise.all([
  import(dataUrl(worldSource)),
  import(dataUrl(distributionSource))
]);
const validationErrors = distribution.validateWorldSystem();
const report = distribution.getDevelopmentReport();
const output = {
  generatedAt: new Date().toISOString(),
  counts: report,
  validation: { valid: validationErrors.length === 0, errors: validationErrors },
  locations: world.WORLD_LOCATIONS.map(location => ({
    id: location.id,
    jurisdictionId: location.jurisdictionId,
    settlementName: location.settlementName,
    status: location.status,
    contentStatus: location.contentStatus,
    environmentAssetId: location.environmentAssetId,
    environmentProfiles: location.environmentProfileIds,
    sectors: location.sectorIds,
    npcProfiles: location.npcProfileIds,
    mainMissions: location.mainMissionIds,
    sideMissions: location.sideMissionIds,
    environmentalEncounters: location.environmentalEncounterIds,
    educationalConcepts: location.educationalConceptIds,
    storyArcId: location.storyArcId,
    unlockRequirement: location.unlockRequirement
  })),
  jurisdictions: world.NIGERIAN_JURISDICTIONS.map(jurisdiction => ({
    id: jurisdiction.id,
    name: jurisdiction.name,
    kind: jurisdiction.kind,
    region: jurisdiction.region,
    administrativeCapital: jurisdiction.administrativeCapital,
    locationIds: jurisdiction.content.locationIds,
    playableLocationIds: world.WORLD_LOCATIONS
      .filter(location => location.jurisdictionId === jurisdiction.id && location.status === "playable")
      .map(location => location.id),
    researchStatus: jurisdiction.regionalContext.researchStatus
  }))
};
console.log(JSON.stringify(output, null, 2));
if (validationErrors.length) process.exitCode = 1;
