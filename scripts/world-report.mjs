import { loadKitCityModules } from "./registry-loader.mjs";

const { world, distribution, prototypeMissions, cleanup } = await loadKitCityModules();
const errors = distribution.validateWorldSystem();
const report = distribution.getDevelopmentReport();
const output = {
  generatedAt: new Date().toISOString(),
  counts: report,
  validation: { status: errors.length ? "FAILED" : "PASS", errors },
  prototypeMissionPack: prototypeMissions.PROTOTYPE_MISSIONS.map(mission => ({
    id:mission.id,title:mission.title,npc:mission.npcName,role:mission.role,conceptId:mission.conceptId,
    locationIds:mission.locationIds,status:mission.status,objectiveCount:mission.objectives.length,
    reward:mission.reward,objectiveLabels:mission.objectives.map(objective=>objective.label)
  })),
  locations: world.WORLD_LOCATIONS.map(location => ({
    id: location.id,
    jurisdictionId: location.jurisdictionId,
    settlementName: location.settlementName,
    status: location.status,
    contentStatus: location.contentStatus,
    environmentAssetId: location.environmentAssetId,
    engineCityId: location.engineCityId,
    environmentProfileIds: location.environmentProfileIds,
    sectorIds: location.sectorIds,
    npcProfileIds: location.npcProfileIds,
    occupationTags: location.occupationTags,
    communityTags: location.communityTags,
    mainMissionIds: location.mainMissionIds,
    sideMissionIds: location.sideMissionIds,
    environmentalEncounterIds: location.environmentalEncounterIds,
    educationalConceptIds: location.educationalConceptIds,
    storyArcId: location.storyArcId,
    unlockRequirement: location.unlockRequirement
  })),
  jurisdictions: world.NIGERIAN_JURISDICTIONS.map(jurisdiction => ({
    id: jurisdiction.id,
    name: jurisdiction.name,
    kind: jurisdiction.kind,
    geopoliticalZone: jurisdiction.region,
    administrativeCapital: jurisdiction.administrativeCapital,
    researchStatus: jurisdiction.regionalContext.researchStatus,
    locationIds: jurisdiction.content.locationIds,
    playableLocationIds: world.WORLD_LOCATIONS
      .filter(location => location.jurisdictionId === jurisdiction.id && location.status === "playable")
      .map(location => location.id),
    configuredMissions: [
      ...jurisdiction.content.mainMissionIds,
      ...jurisdiction.content.sideMissionIds
    ],
    configuredNpcProfiles: jurisdiction.content.npcProfileIds,
    configuredConcepts: jurisdiction.content.educationalConceptIds
  }))
};
console.log("KitCity Nigerian World Development Report");
console.log(JSON.stringify(output, null, 2));
await cleanup();
if (errors.length) process.exitCode = 1;
