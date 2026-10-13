import { readFile, access } from "node:fs/promises";
import { MISSIONS, CHAPTERS, CHARACTER_ORDER, validateChronicles } from "./chronicles.js";

const engine = await readFile(new URL("../kitcity-engine.js", import.meta.url), "utf8");
const registry = await readFile(new URL("./chronicles.js", import.meta.url), "utf8");
const errors = [...validateChronicles().errors];

if (MISSIONS.length !== 0) errors.push("The runtime must not register retired missions.");
if (CHAPTERS.length !== 0) errors.push("The runtime must not register retired chapters.");
if (CHARACTER_ORDER.length !== 0) errors.push("The runtime must not register the retired cast.");
for (const text of [
  "RAW_MISSIONS",
  "CHRONICLE_ACTIVITY_RULES",
  "STORY_BRIDGES",
  "STORY_PLAYER_REACTIONS",
  "CHRONICLE_CHALLENGES",
  "chronicleAuthoredStep",
  "Mission badges",
  "Finish mission 1",
  "TEST MODE · ALL MISSIONS UNLOCKED"
]) {
  if (engine.includes(text) || registry.includes(text)) errors.push("Retired storyline content remains: " + text);
}
for (const text of [
  "Storyline in preparation",
  "No mission records",
  "const MISSIONS=[]",
  "STORY_RESET_VERSION=1"
]) {
  if (!engine.includes(text)) errors.push("Empty-story runtime integration missing: " + text);
}
try {
  await access(new URL("../story-scene-director.js", import.meta.url));
  errors.push("The retired opening scene file still exists.");
} catch {}

if (errors.length) {
  console.error("EMPTY STORY RUNTIME VALIDATION FAILED");
  errors.forEach((error) => console.error(" - " + error));
  process.exitCode = 1;
} else {
  console.log("EMPTY STORY RUNTIME VALIDATION PASSED");
  console.log("No retired missions, chapters, cast, or opening scene remain.");
  console.log("Mission and passport UI display empty states.");
}
