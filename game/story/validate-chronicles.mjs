import {
  CHARACTER_ORDER,
  CHAPTERS,
  FIRST_ENCOUNTER_ORDER,
  MISSIONS,
  NIGERIAN_STATES,
  STATE_ROUTE,
  validateChronicles,
} from "./chronicles.js";

const report = validateChronicles();
const expectedMissionFields = [
  "id", "chapterId", "title", "state", "location", "npcs",
  "narrativePurpose", "learningObjectives",
  "prerequisites", "objectives", "successConditions", "failureAndRetry",
  "rewards", "storyFlags", "nextMissionId", "ending", "cliffhanger",
];
const errors = [...report.errors];

for (const mission of MISSIONS) {
  for (const field of expectedMissionFields) {
    if (!(field in mission)) errors.push(mission.id + " missing field " + field);
  }
  if ("openingPanels" in mission || "dialogue" in mission) errors.push(mission.id + " still contains retired duplicate panel/dialogue data");
  if (!mission.failureAndRetry.retry) errors.push(mission.id + " has no retry path");
  if (!mission.rewards.skillBadges.length) errors.push(mission.id + " has no skill reward");
}

const chapterMissionIds = new Set(CHAPTERS.flatMap((chapter) => chapter.missionIds));
for (const mission of MISSIONS) {
  if (!chapterMissionIds.has(mission.id)) errors.push(mission.id + " is not assigned to a chapter");
}
if (FIRST_ENCOUNTER_ORDER.length !== 50) errors.push("Expected 50 first character encounters");
if (FIRST_ENCOUNTER_ORDER.some((name, index) => name !== CHARACTER_ORDER[index])) {
  errors.push("Character encounter order differs from the supplied order");
}
if (NIGERIAN_STATES.length !== 36 || STATE_ROUTE.length !== 36) errors.push("Expected coverage plan for all 36 states");
if (STATE_ROUTE.some((stop) => stop.state === "Federal Capital Territory")) errors.push("FCT must not be a required destination");

if (errors.length) {
  console.error("CHRONICLES VALIDATION FAILED");
  errors.forEach((error) => console.error(" - " + error));
  process.exitCode = 1;
} else {
  console.log("CHRONICLES VALIDATION PASSED");
  console.log("Missions: " + MISSIONS.length);
  console.log("Chapters: " + CHAPTERS.length);
  console.log("Character order: " + CHARACTER_ORDER.length + " verified");
  console.log("State route: " + STATE_ROUTE.length + " states; no FCT");
}
