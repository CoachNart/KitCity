import {
  CHARACTER_ORDER,
  CHAPTERS,
  FIRST_ENCOUNTER_ORDER,
  MISSIONS,
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
const implementedStoryStates = new Set(MISSIONS.map((mission) => mission.state));
for (const chapter of CHAPTERS) {
  if (!implementedStoryStates.has(chapter.state)) errors.push("Chapter references a state without a registered mission: " + chapter.state);
}

if (errors.length) {
  console.error("CHRONICLES VALIDATION FAILED");
  errors.forEach((error) => console.error(" - " + error));
  process.exitCode = 1;
} else {
  console.log("CHRONICLES VALIDATION PASSED");
  console.log("Missions: " + MISSIONS.length);
  console.log("Chapters: " + CHAPTERS.length);
  console.log("Character order: " + CHARACTER_ORDER.length + " verified");
  console.log("Implemented story locations: " + new Set(MISSIONS.map((mission) => mission.state)).size);
}
