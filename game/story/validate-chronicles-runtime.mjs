import { readFile } from "node:fs/promises";
import { CHARACTER_ORDER, MISSIONS, validateChronicles } from "./chronicles.js";

const engine = await readFile(new URL("../kitcity-engine.js", import.meta.url), "utf8");
const errors = [...validateChronicles().errors];
const requireText = (text, label) => {
  if (!engine.includes(text)) errors.push("Runtime integration missing: " + label);
};

requireText("MISSIONS as CHRONICLE_MISSIONS, CHARACTER_ORDER", "canonical registry import");
requireText("const MISSIONS=CHRONICLE_MISSIONS.map", "runtime mission adapter");
requireText("if(m.id==='m01'&&!P.storyPrologueSeen)", "opening cinematic gate");
requireText("P.storyProgress[G.m.id]", "per-mission progress save");
requireText("missionGroup.visible=false; storyCastGroup.visible=true", "opening scene staging");
requireText("const CHRONICLE_ACTIVITY_RULES=[", "objective activity bank");
requireText("function applyChronicleActivityEffect", "safe simulated activity effects");
requireText("P.storyFlags.future_direction=options[choice]", "player-owned ending choice");
if (engine.includes("No USDC left — mission restarting!")) errors.push("Legacy collision reset remains");
if (engine.includes("const MISSIONS=[")) errors.push("Legacy hard-coded mission array still exists");
for (const stale of ["function askStep(o)", "function taskStep(o)", "function confirmTx(def,o)", "function needFunds(n)", "QUESTION_PENALTY"]) {
  if (engine.includes(stale)) errors.push("Legacy mission mechanic remains: " + stale);
}

const cityBlock = engine.match(/const STORY_CITY_BY_STATE=\{([\s\S]*?)\};/);
if (!cityBlock) {
  errors.push("Story state-to-city mapping is missing");
} else {
  const mapping = Object.fromEntries([...cityBlock[1].matchAll(/'([^']+)':'([^']+)'/g)].map((m) => [m[1], m[2]]));
  const cityKeys = new Set([...engine.matchAll(/^\s{2}([a-z][a-z0-9-]*):\{name:/gm)].map((m) => m[1]));
  cityKeys.add("kitcity");
  for (const mission of MISSIONS) {
    const city = mapping[mission.state];
    if (!city) errors.push(mission.id + " has no city mapping for " + mission.state);
    else if (!cityKeys.has(city)) errors.push(mission.id + " maps to unknown city " + city);
  }
}

const challengeStart = engine.indexOf("const CHRONICLE_CHALLENGES={");
const challengeEnd = engine.indexOf("\n};\nfunction escapeStoryHtml", challengeStart);
if (challengeStart < 0 || challengeEnd < 0) {
  errors.push("Mission challenge registry cannot be found");
} else {
  const keys = new Set([...engine.slice(challengeStart, challengeEnd).matchAll(/^\s*(m\d+):\{/gm)].map((m) => m[1]));
  for (const mission of MISSIONS.filter((m) => m.id !== "m01")) {
    if (!keys.has(mission.id)) errors.push(mission.id + " has no core mission challenge");
  }
}

const activityStart = engine.indexOf("const CHRONICLE_ACTIVITY_RULES=[");
const activityEnd = engine.indexOf("\n];\nfunction chronicleActivityFor", activityStart);
if (activityStart < 0 || activityEnd < 0) {
  errors.push("Mission activity rules cannot be found");
} else {
  try {
    const rules = new Function(engine.slice(activityStart, activityEnd + 3) + "\nreturn CHRONICLE_ACTIVITY_RULES;")();
    let checked = 0;
    for (const mission of MISSIONS.filter((m) => m.id !== "m01")) {
      for (const objective of mission.objectives.slice(1)) {
        checked++;
        if (!rules.some((rule) => rule.r.test(objective.label))) {
          errors.push(mission.id + " objective has no contextual activity: " + objective.label);
        }
      }
    }
    if (checked < 100) errors.push("Expected a broad objective activity coverage check");
    if (!errors.length) console.log("Runtime objective activities: " + checked + " covered by " + rules.length + " activity rules");
  } catch (error) {
    errors.push("Could not evaluate activity rules: " + error.message);
  }
}

if (CHARACTER_ORDER.length !== 50) errors.push("Expected all 50 supplied character names");
if (errors.length) {
  console.error("CHRONICLES RUNTIME VALIDATION FAILED");
  errors.forEach((error) => console.error(" - " + error));
  process.exitCode = 1;
} else {
  console.log("CHRONICLES RUNTIME VALIDATION PASSED");
  console.log("Missions: " + MISSIONS.length + "; supplied characters: " + CHARACTER_ORDER.length);
  console.log("State mapping: every story mission mapped; KitCity is the final destination; FCT is not a story stop");
}
