import { CHARACTER_ORDER, CHAPTERS, FIRST_ENCOUNTER_ORDER, MISSIONS, validateStoryRegistry } from "./storyline-registry.js";

const report = validateStoryRegistry();
const errors = [...report.errors];
if (MISSIONS.length !== 0) errors.push("The retired mission catalogue must remain empty.");
if (CHAPTERS.length !== 0) errors.push("The retired chapter catalogue must remain empty.");
if (CHARACTER_ORDER.length !== 0 || FIRST_ENCOUNTER_ORDER.length !== 0) errors.push("The retired storyline cast must remain empty.");
if (report.missionCount !== 0 || report.characterCount !== 0) errors.push("Story validation must report zero retired content.");

if (errors.length) {
  console.error("EMPTY STORY REGISTRY VALIDATION FAILED");
  errors.forEach((error) => console.error(" - " + error));
  process.exitCode = 1;
} else {
  console.log("EMPTY STORY REGISTRY VALIDATION PASSED");
  console.log("Missions: 0");
  console.log("Chapters: 0");
  console.log("Story characters: 0");
}
