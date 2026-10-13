import { readFile } from "node:fs/promises";
import { MISSIONS, CHAPTERS, CHARACTER_ORDER, validateStoryRegistry } from "./storyline-registry.js";

const engine = await readFile(new URL("../kitcity-engine.js", import.meta.url), "utf8");
const errors = [...validateStoryRegistry().errors];

if (MISSIONS.length !== 0) errors.push("The mission registry must be empty.");
if (CHAPTERS.length !== 0) errors.push("The chapter registry must be empty.");
if (CHARACTER_ORDER.length !== 0) errors.push("The retired story cast must be empty.");
if (!engine.includes("Storyline in preparation")) errors.push("The empty storyline state is missing from the mission screen.");
if (!engine.includes("No journey records")) errors.push("The empty storyline state is missing from the passport screen.");
if (!engine.includes("const MISSIONS=[];")) errors.push("The runtime must not register mission content.");
if (engine.includes("function missionCard(")) errors.push("The old mission-card renderer remains.");

if (errors.length) {
  console.error("EMPTY STORY RUNTIME VALIDATION FAILED");
  errors.forEach((error) => console.error(" - " + error));
  process.exitCode = 1;
} else {
  console.log("EMPTY STORY RUNTIME VALIDATION PASSED");
  console.log("Mission, chapter, and cast registries are empty.");
  console.log("Mission and passport screens show empty states.");
}
