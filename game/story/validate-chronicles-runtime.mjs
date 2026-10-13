import { readFile, access } from "node:fs/promises";
import { MISSIONS, CHAPTERS, CHARACTER_ORDER, validateChronicles } from "./chronicles.js";

const engine = await readFile(new URL("../kitcity-engine.js", import.meta.url), "utf8");
const errors = [...validateChronicles().errors];

if (MISSIONS.length !== 0) errors.push("The mission registry must be empty.");
if (CHAPTERS.length !== 0) errors.push("The chapter registry must be empty.");
if (CHARACTER_ORDER.length !== 0) errors.push("The retired story cast must be empty.");
if (!engine.includes("Storyline in preparation")) errors.push("The empty storyline state is missing from the mission screen.");
if (!engine.includes("No mission records")) errors.push("The empty storyline state is missing from the passport screen.");
if (!engine.includes("const MISSIONS=[];")) errors.push("The runtime must not register mission content.");
if (engine.includes("function missionCard(")) errors.push("The old mission-card renderer remains.");

try {
  await access(new URL("../story-scene-director.js", import.meta.url));
  errors.push("A retired story-scene file remains.");
} catch {}

if (errors.length) {
  console.error("EMPTY STORY RUNTIME VALIDATION FAILED");
  errors.forEach((error) => console.error(" - " + error));
  process.exitCode = 1;
} else {
  console.log("EMPTY STORY RUNTIME VALIDATION PASSED");
  console.log("No mission catalogue, chapter catalogue, cast, or opening scene remains.");
  console.log("Mission and passport screens show empty states.");
}
