import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = relative => readFile(path.join(root, relative), "utf8");
const dataUrl = source => "data:text/javascript;base64," + Buffer.from(source).toString("base64");
const [worldSource, educationSource, dialogueSource, adventureSource, distributionSource] = await Promise.all([
  read("game/world-registry.js"),
  read("game/educational-content.js"),
  read("game/dialogue-content.js"),
  read("game/adventure-data.js"),
  read("game/mission-distribution.js")
]);
const worldUrl = dataUrl(worldSource);
const educationUrl = dataUrl(educationSource);
const dialogueUrl = dataUrl(dialogueSource.replace('"./educational-content.js"', JSON.stringify(educationUrl)));
const adventureUrl = dataUrl(adventureSource.replace('"./world-registry.js"', JSON.stringify(worldUrl)));
const distributionUrl = dataUrl(distributionSource
  .replace('"./world-registry.js"', JSON.stringify(worldUrl))
  .replace('"./educational-content.js"', JSON.stringify(educationUrl))
  .replace('"./dialogue-content.js"', JSON.stringify(dialogueUrl))
  .replace('"./adventure-data.js"', JSON.stringify(adventureUrl)));
const registry = await import(distributionUrl);
const errors = registry.validateWorldSystem();
const report = registry.getDevelopmentReport();
console.log("KitCity Nigerian World Development Report");
console.log(JSON.stringify({ ...report, validation: errors.length ? "FAILED" : "PASS", validationErrors: errors }, null, 2));
if (errors.length) process.exitCode = 1;
