/**
 * Location-aware educational mission selection and registry validation.
 * This module consumes registries; the conversation engine stays location-agnostic.
 */
import {
  NIGERIAN_STATES, NIGERIAN_TERRITORIES, NIGERIAN_JURISDICTIONS,
  WORLD_LOCATIONS, PLANNED_SETTLEMENT_LOCATIONS, ENVIRONMENT_ASSET_REGISTRY, ENVIRONMENT_PROFILES, SECTOR_REGISTRY
} from "./world-registry.js";
import {
  EDUCATIONAL_CONCEPTS, EDUCATIONAL_MISSIONS, EDUCATIONAL_PROFILES,
  getAvailableEducationalMissions
} from "./educational-content.js";
import { KITCITY_DIALOGUES, getDialogue } from "./dialogue-content.js";
import { SOCIAL_ADVENTURE_NPCS } from "./adventure-data.js";

export const NPC_PERSPECTIVES = {
  "credential-verifier": {ageRange:"40s-50s",economicContext:"public-facing school administration",technicalFluency:"practical digital user",stance:"careful and process-oriented"},
  "farm-coop": {ageRange:"30s-50s",economicContext:"smallholder livelihood with seasonal uncertainty",technicalFluency:"low-to-practical; values local evidence",stance:"skeptical of costly systems"},
  "market-ledger": {ageRange:"30s-50s",economicContext:"independent trader with cash-flow pressure",technicalFluency:"mobile-first practical user",stance:"pragmatic and time-sensitive"},
  "clinic-privacy": {ageRange:"30s-50s",economicContext:"community health work with limited resources",technicalFluency:"confident with care workflows, cautious with new systems",stance:"privacy-first"},
  "legal-clerk": {ageRange:"40s-60s",economicContext:"small-business legal practice",technicalFluency:"analytical non-specialist",stance:"skeptical, evidence-led"},
  "skills-mentor": {ageRange:"30s-50s",economicContext:"independent skilled trade and irregular customer demand",technicalFluency:"hands-on practical user",stance:"trusts demonstrated ability over badges"},
  "music-producer": {ageRange:"20s-40s",economicContext:"independent creative work with variable income",technicalFluency:"comfortable with creator tools; cautious about hype",stance:"protective of creator rights"},
  "community-steward": {ageRange:"30s-60s",economicContext:"voluntary or cooperative community leadership",technicalFluency:"varies; values transparent process",stance:"fairness-focused"},
  "privacy-guide": {ageRange:"20s-30s",economicContext:"student/early-career designer",technicalFluency:"digitally confident",stance:"curious and privacy-conscious"},
  "network-builder": {ageRange:"20s-40s",economicContext:"local network maintenance and small-contract work",technicalFluency:"experienced technical professional",stance:"pro-infrastructure but cost-aware"},
  "property-clerk": {ageRange:"40s-60s",economicContext:"documentation and property administration",technicalFluency:"comfortable with records, cautious with token claims",stance:"risk-averse and evidence-led"},
  "news-researcher": {ageRange:"20s-40s",economicContext:"local journalism with limited verification time",technicalFluency:"media-literate, not omniscient",stance:"curious and evidence-first"},
  "security-coach": {ageRange:"20s-40s",economicContext:"phone repair and customer-support livelihood",technicalFluency:"hands-on security experience",stance:"direct, protective, non-shaming"},
  "open-source-builder": {ageRange:"20s-40s",economicContext:"developer or contract-based technical work",technicalFluency:"experienced",stance:"supports open standards but challenges branding"},
  "creator-rights": {ageRange:"late teens-20s",economicContext:"student and early-stage independent creator",technicalFluency:"creative-tool fluent, still learning legal distinctions",stance:"ambitious and questioning"}
};

const MISSION_CONTEXT = {
  "learn-digital-ownership": ["technology-creative-hub","market-edge"],
  "learn-portable-credentials": ["school-campus","market-edge"],
  "learn-agriculture-traceability": ["farm-cooperative","market-edge"],
  "learn-agriculture-cooperative-audit": ["farm-cooperative"],
  "learn-commerce-payments": ["market-edge"],
  "learn-health-data-rights": ["health-facility"],
  "learn-smart-contracts": ["legal-professional-office","market-edge"],
  "learn-professional-credentials": ["workshop-industrial","school-campus","market-edge"],
  "learn-creative-rights": ["technology-creative-hub","tourism-cultural"],
  "learn-community-governance": ["government-civic","residential-neighborhood","public-space"],
  "learn-decentralized-identity": ["school-campus","government-civic","market-edge"],
  "learn-decentralized-infrastructure": ["energy-utility","residential-neighborhood"],
  "learn-tokenization": ["legal-professional-office","construction-real-estate"],
  "learn-verifiable-ai": ["technology-creative-hub","tourism-cultural"],
  "learn-security-and-limits": ["market-edge","residential-neighborhood","technology-creative-hub"],
  "learn-open-internet": ["technology-creative-hub","residential-neighborhood","public-space"]
};

export const MISSION_DISTRIBUTION = EDUCATIONAL_MISSIONS.map(mission => ({
  missionId: mission.id,
  conceptId: mission.conceptId,
  npcProfileId: mission.npcId,
  dialogueId: mission.id,
  sectorIds: mission.sectors.map(sector => sectorToId(sector)),
  preferredEnvironmentProfileIds: MISSION_CONTEXT[mission.id] || [],
  locationIds: WORLD_LOCATIONS.filter(location =>
    location.status === "playable" &&
    (MISSION_CONTEXT[mission.id] || []).some(profileId => location.environmentProfileIds.includes(profileId))
  ).map(location => location.id),
  repeatPolicy: "new-context-required",
  status: WORLD_LOCATIONS.some(location => location.status === "playable" &&
    (MISSION_CONTEXT[mission.id] || []).some(profileId => location.environmentProfileIds.includes(profileId)))
    ? "available-in-playable-environment" : "authored-awaiting-environment"
}));


// Derive jurisdiction-level indexes from authored content; empty registries remain valid for unbuilt states.
for (const location of WORLD_LOCATIONS) {
  const assigned = MISSION_DISTRIBUTION.filter(item => item.locationIds.includes(location.id));
  location.npcProfileIds = [...new Set(assigned.map(item => item.npcProfileId))];
  location.sideMissionIds = [...new Set(assigned.map(item => item.missionId))];
  location.educationalConceptIds = [...new Set(assigned.map(item => item.conceptId))];
  const jurisdiction = NIGERIAN_JURISDICTIONS.find(item => item.id === location.jurisdictionId);
  if (jurisdiction) {
    const content = jurisdiction.content;
    content.locationIds = [...new Set([...content.locationIds, location.id])];
    content.environmentProfiles = [...new Set([...content.environmentProfiles, ...(location.environmentProfileIds || [])])];
    content.npcProfileIds = [...new Set([...content.npcProfileIds, ...location.npcProfileIds])];
    content.sideMissionIds = [...new Set([...content.sideMissionIds, ...location.sideMissionIds])];
    content.educationalConceptIds = [...new Set([...content.educationalConceptIds, ...location.educationalConceptIds])];
    content.storyArcId = location.storyArcId || content.storyArcId;
  }
}

export const NPC_REGISTRY = [
  ...EDUCATIONAL_PROFILES.map(profile => ({
    ...profile, category:"educational", diversity:NPC_PERSPECTIVES[profile.id] || null,
    dialogueIds:EDUCATIONAL_MISSIONS.filter(mission => mission.npcId === profile.id).map(mission => mission.id)
  })),
  ...SOCIAL_ADVENTURE_NPCS.map(profile => ({
    id:profile.npcProfileId, encounterId:profile.id, name:profile.name, role:profile.role,
    category:"social", diversity:{ageRange:profile.ageRange,economicContext:profile.economicContext,technicalFluency:profile.technicalFluency,stance:profile.stance},
    dialogueIds:[profile.dialogueId]
  }))
];

export const DIALOGUE_REGISTRY = [
  ...KITCITY_DIALOGUES.map(dialogue => ({id:dialogue.id, kind:"social", npcId:dialogue.npcId, missionId:dialogue.missionId || null})),
  ...EDUCATIONAL_MISSIONS.map(mission => ({id:mission.id, kind:"educational-mission", npcId:mission.npcId, missionId:mission.missionId}))
];

export const MISSION_REWARD_REGISTRY = EDUCATIONAL_MISSIONS.map(mission => ({
  id: "reward:" + mission.id, missionId: mission.missionId,
  xp: mission.reward?.xp || 0, simulatedNgn: mission.reward?.ngn || 0,
  delivery: "in-game-simulation"
}));

export const REWARD_REGISTRY = [
  ...MISSION_REWARD_REGISTRY,
  ...SOCIAL_ADVENTURE_NPCS.map(encounter => ({
    id: "reward:" + encounter.id, encounterId: encounter.id,
    xp: encounter.reward?.xp || 0, simulatedNgn: encounter.reward?.ngn || 0,
    item: encounter.reward?.item || null, delivery: "in-game-simulation"
  }))
];

export const LOCATION_EVENT_REGISTRY = [{
  id: "pothole-awareness",
  type: "environmental-hazard",
  locationIds: ["lagos-free-roam"],
  status: "implemented",
  behavior: "visual-warning-and-toast",
  rewardId: null
}];

export const STORY_ARCS = [{
  id: "kitcity-open-world-introduction",
  title: "KitCity open-world introduction",
  locationIds: ["lagos-free-roam"],
  unlockRequirement: null,
  status: "active"
}];

function sectorToId(sector) {
  const aliases = {
    commerce:"commerce-retail", "creative-industries":"music-creative-industries",
    music:"music-creative-industries", art:"music-creative-industries", media:"media-entertainment", "real estate":"construction-real-estate", construction:"construction-real-estate",
    "public administration":"government-public-administration", community:"civil-society-community",
    employment:"professional-services", "open source":"technology", privacy:"professional-services",
    identity:"professional-services", infrastructure:"energy", connectivity:"telecommunications",
    property:"construction-real-estate", research:"professional-services", security:"technology", "supply chain":"transport-logistics", ai:"technology",
    computing:"technology", internet:"technology", software:"technology", "social networks":"media-entertainment",
    "small business":"small-business", healthcare:"healthcare", finance:"finance",
    education:"education", agriculture:"agriculture", law:"law", governance:"government-public-administration"
  };
  const key = String(sector).toLowerCase();
  return aliases[key] || (SECTOR_REGISTRY.some(item => item.id === key) ? key : null);
}

export function selectEducationalMissions({
  locationId = "lagos-free-roam", dialogueState = {}, limit = 6, allowDeepening = false
} = {}) {
  const location = WORLD_LOCATIONS.find(item => item.id === locationId && item.status === "playable");
  if (!location || limit <= 0) return [];
  const supportedProfiles = new Set(location.environmentProfileIds);
  const eligible = getAvailableEducationalMissions(dialogueState).filter(mission => {
    const contextIds = MISSION_CONTEXT[mission.id] || [];
    return contextIds.some(id => supportedProfiles.has(id));
  });
  const known = dialogueState.knowledge || {};
  const completed = dialogueState.completedMissions || {};
  const conceptHistory = dialogueState.conceptHistory || {};
  const usedConcepts = new Set(Object.keys(known).filter(id => known[id]));
  const selected = [];
  for (const mission of eligible) {
    const alreadyCompleted = Boolean(completed[mission.missionId]);
    const repeatsKnown = usedConcepts.has(mission.conceptId);
    if (alreadyCompleted) continue;
    if (repeatsKnown) {
      if (!allowDeepening) continue;
      const priorContexts = conceptHistory[mission.conceptId] || [];
      if (priorContexts.some(entry => entry.locationId === locationId || entry.missionId === mission.id)) continue;
    }
    selected.push(mission);
    if (selected.length >= limit) break;
  }
  return selected;
}

function allEdges(content, node) {
  return (node.choices || []).flatMap(choice => {
    if (choice.end) return [];
    if (typeof choice.next === "string") return [choice.next];
    if (choice.next && typeof choice.next === "object") return [choice.next.then, choice.next.else].filter(Boolean);
    return [];
  });
}

function graphReachable(content) {
  const seen = new Set();
  const pending = [content.start];
  while (pending.length) {
    const id = pending.pop();
    if (seen.has(id) || !content.nodes?.[id]) continue;
    seen.add(id);
    pending.push(...allEdges(content, content.nodes[id]));
  }
  return seen;
}

function canReachMissionCompletion(content, nodeId, seen = new Set()) {
  if (seen.has(nodeId) || !content.nodes?.[nodeId]) return false;
  const nextSeen = new Set(seen); nextSeen.add(nodeId);
  const node = content.nodes[nodeId];
  for (const choice of node.choices || []) {
    if (choice.completeMission === content.missionId ||
        (choice.end && choice.completeConversation && content.missionId)) return true;
    if (!choice.end) {
      const targets = typeof choice.next === "string" ? [choice.next] :
        choice.next && typeof choice.next === "object" ? [choice.next.then, choice.next.else].filter(Boolean) : [];
      if (targets.some(target => canReachMissionCompletion(content, target, nextSeen))) return true;
    }
  }
  return false;
}

export function validateWorldSystem({ additionalLocations = [] } = {}) {
  const locations = [...WORLD_LOCATIONS, ...additionalLocations];
  const errors = [];
  const unique = (items, label) => {
    const seen = new Set();
    for (const item of items) {
      if (!item?.id) errors.push(label + " has a record without an id");
      else if (seen.has(item.id)) errors.push("duplicate " + label + " id: " + item.id);
      else seen.add(item.id);
    }
    return seen;
  };
  const stateIds = unique(NIGERIAN_STATES, "state");
  const territoryIds = unique(NIGERIAN_TERRITORIES, "territory");
  const locationIds = unique(locations, "location");
  const environmentAssetIds = unique(ENVIRONMENT_ASSET_REGISTRY, "environment asset");
  const sectorIds = unique(SECTOR_REGISTRY, "sector");
  const eventIds = unique(LOCATION_EVENT_REGISTRY, "location event");
  const storyArcIds = unique(STORY_ARCS, "story arc");
  const rewardIds = unique(REWARD_REGISTRY, "reward");
  unique(ENVIRONMENT_PROFILES, "environment profile");
  const conceptIds = unique(EDUCATIONAL_CONCEPTS, "concept");
  const missionIds = unique(EDUCATIONAL_MISSIONS, "mission");
  const npcIds = unique(NPC_REGISTRY, "NPC profile");
  const dialogueIds = unique([...KITCITY_DIALOGUES, ...EDUCATIONAL_MISSIONS], "dialogue");
  if (NIGERIAN_STATES.length !== 36) errors.push("expected 36 states; found " + NIGERIAN_STATES.length);
  if (NIGERIAN_TERRITORIES.length !== 1 || NIGERIAN_TERRITORIES[0]?.id !== "fct") errors.push("FCT must be represented separately from the 36 states");
  if (NIGERIAN_JURISDICTIONS.length !== 37) errors.push("expected 37 Nigerian jurisdictions");
  const validLocationStatuses = new Set(["playable", "planned", "in-development", "retired"]);
  const knownMissionRefs = new Set([
    ...EDUCATIONAL_MISSIONS.flatMap(mission => [mission.id, mission.missionId]),
    ...KITCITY_DIALOGUES.flatMap(dialogue => [dialogue.id, dialogue.missionId].filter(Boolean)),
    ...SOCIAL_ADVENTURE_NPCS.map(encounter => encounter.id)
  ]);
  for (const location of locations) {
    if (!stateIds.has(location.jurisdictionId) && !territoryIds.has(location.jurisdictionId)) errors.push(location.id + ": references missing jurisdiction " + location.jurisdictionId);
    if (!validLocationStatuses.has(location.status)) errors.push(location.id + ": invalid location status " + location.status);
    if (!location.settlementName || !location.locationType) errors.push(location.id + ": missing location identity fields");
    for (const slot of ["environmentProfileIds","sectorIds","npcProfileIds","npcSpawnPoints","occupationTags","communityTags","mainMissionIds","sideMissionIds","environmentalEncounterIds","educationalConceptIds"]) {
      if (!Array.isArray(location[slot])) errors.push(location.id + ": " + slot + " must be an array");
    }
    if (!location.environmentSettings || typeof location.environmentSettings !== "object" || Array.isArray(location.environmentSettings)) errors.push(location.id + ": environmentSettings must be an object");
    for (const spawnPoint of location.npcSpawnPoints || []) {
      if (!spawnPoint.position || !Number.isFinite(spawnPoint.position.x) || !Number.isFinite(spawnPoint.position.z)) errors.push(location.id + ": NPC spawn point requires numeric x/z coordinates");
      if (!spawnPoint.missionId && !spawnPoint.npcProfileId && !spawnPoint.encounterId) errors.push(location.id + ": NPC spawn point must identify a mission, NPC profile or encounter");
      if (spawnPoint.missionId && !knownMissionRefs.has(spawnPoint.missionId)) errors.push(location.id + ": NPC spawn point references missing mission " + spawnPoint.missionId);
      if (spawnPoint.npcProfileId && !npcIds.has(spawnPoint.npcProfileId)) errors.push(location.id + ": NPC spawn point references missing NPC profile " + spawnPoint.npcProfileId);
      if (spawnPoint.encounterId && !SOCIAL_ADVENTURE_NPCS.some(encounter => encounter.id === spawnPoint.encounterId)) errors.push(location.id + ": NPC spawn point references missing encounter " + spawnPoint.encounterId);
    }
    for (const profileId of location.environmentProfileIds || []) if (!ENVIRONMENT_PROFILES.some(profile => profile.id === profileId)) errors.push(location.id + ": unknown environment profile " + profileId);
    for (const sectorId of location.sectorIds || []) if (!sectorIds.has(sectorId)) errors.push(location.id + ": unknown sector " + sectorId);
    for (const npcId of location.npcProfileIds || []) if (!npcIds.has(npcId)) errors.push(location.id + ": unknown NPC profile " + npcId);
    for (const missionRef of [...(location.mainMissionIds || []), ...(location.sideMissionIds || [])]) if (!knownMissionRefs.has(missionRef)) errors.push(location.id + ": unknown mission " + missionRef);
    for (const conceptId of location.educationalConceptIds || []) if (!conceptIds.has(conceptId)) errors.push(location.id + ": unknown educational concept " + conceptId);
    if (location.status === "playable" && (!location.environmentAssetId || !location.engineCityId)) errors.push(location.id + ": playable location must reference an existing environment asset and engine city");
    if (location.status === "playable") {
      const asset = ENVIRONMENT_ASSET_REGISTRY.find(item => item.id === location.environmentAssetId && item.status === "available");
      if (!asset) errors.push(location.id + ": references an environment asset that is not registered as available");
      else if (asset.engineCityId !== location.engineCityId) errors.push(location.id + ": environment asset and engine city do not match");
    }
    if (location.status === "planned" && (location.environmentAssetId || location.engineCityId)) errors.push(location.id + ": planned location must not claim a wired environment asset");
    if (location.storyArcId && !storyArcIds.has(location.storyArcId)) errors.push(location.id + ": references missing story arc " + location.storyArcId);
    for (const eventId of location.environmentalEncounterIds || []) if (!eventIds.has(eventId)) errors.push(location.id + ": references missing location event " + eventId);
    if (location.unlockRequirement?.completedMission && !knownMissionRefs.has(location.unlockRequirement.completedMission)) errors.push(location.id + ": unlock requirement references missing mission " + location.unlockRequirement.completedMission);
  }
  if (PLANNED_SETTLEMENT_LOCATIONS.length !== NIGERIAN_JURISDICTIONS.length) errors.push("every jurisdiction must have a registry-only settlement record");
  for (const jurisdiction of NIGERIAN_JURISDICTIONS) {
    const records = locations.filter(location => location.jurisdictionId === jurisdiction.id);
    if (!records.length) errors.push(jurisdiction.id + ": has no location registry record");
    const settlement = PLANNED_SETTLEMENT_LOCATIONS.find(location => location.id === "settlement-" + jurisdiction.id);
    if (!settlement || settlement.settlementName !== jurisdiction.administrativeCapital || settlement.status !== "planned") errors.push(jurisdiction.id + ": missing or mismatched administrative-capital registry record");
    if (!Array.isArray(jurisdiction.content.locationIds)) errors.push(jurisdiction.id + ": location index must be an array");
    for (const locationId of jurisdiction.content.locationIds || []) {
      const location = locations.find(item => item.id === locationId);
      if (!location || location.jurisdictionId !== jurisdiction.id) errors.push(jurisdiction.id + ": invalid indexed location " + locationId);
    }
    for (const npcId of jurisdiction.content.npcProfileIds || []) if (!npcIds.has(npcId)) errors.push(jurisdiction.id + ": unknown indexed NPC " + npcId);
    for (const missionId of [...(jurisdiction.content.mainMissionIds || []), ...(jurisdiction.content.sideMissionIds || [])]) if (!knownMissionRefs.has(missionId)) errors.push(jurisdiction.id + ": unknown indexed mission " + missionId);
    for (const conceptId of jurisdiction.content.educationalConceptIds || []) if (!conceptIds.has(conceptId)) errors.push(jurisdiction.id + ": unknown indexed concept " + conceptId);
  }
  for (const event of LOCATION_EVENT_REGISTRY) for (const locationId of event.locationIds || []) if (!locationIds.has(locationId)) errors.push(event.id + ": references missing location " + locationId);
  for (const event of LOCATION_EVENT_REGISTRY) if (event.rewardId && !rewardIds.has(event.rewardId)) errors.push(event.id + ": references missing reward " + event.rewardId);
  for (const arc of STORY_ARCS) for (const locationId of arc.locationIds || []) if (!locationIds.has(locationId)) errors.push(arc.id + ": references missing location " + locationId);
  for (const reward of MISSION_REWARD_REGISTRY) if (!EDUCATIONAL_MISSIONS.some(mission => mission.missionId === reward.missionId)) errors.push(reward.id + ": references missing mission " + reward.missionId);
  for (const mission of EDUCATIONAL_MISSIONS) {
    if (!conceptIds.has(mission.conceptId)) errors.push(mission.id + ": references missing concept " + mission.conceptId);
    if (!npcIds.has(mission.npcId)) errors.push(mission.id + ": references missing NPC profile " + mission.npcId);
    if (!NPC_REGISTRY.some(npc => npc.id === mission.npcId && npc.dialogueIds.includes(mission.id))) errors.push(mission.id + ": NPC registry is missing its dialogue association");
    if (!MISSION_REWARD_REGISTRY.some(reward => reward.missionId === mission.missionId)) errors.push(mission.id + ": missing reward registry record");
    if (!getDialogue(mission.id)) errors.push(mission.id + ": NPC mission references missing dialogue");
    for (const prerequisite of mission.prerequisites || []) if (!conceptIds.has(prerequisite)) errors.push(mission.id + ": invalid concept prerequisite " + prerequisite);
    const distribution = MISSION_DISTRIBUTION.find(item => item.missionId === mission.id);
    if (!distribution) errors.push(mission.id + ": missing distribution record");
    else {
      for (const locationId of distribution.locationIds) if (!locationIds.has(locationId)) errors.push(mission.id + ": references missing location " + locationId);
      for (const sectorId of distribution.sectorIds) if (sectorId && !sectorIds.has(sectorId)) errors.push(mission.id + ": references missing sector " + sectorId);
    }
    if (!canReachMissionCompletion(mission, mission.start)) errors.push(mission.id + ": no reachable mission-completion path");
  }
  for (const profile of EDUCATIONAL_PROFILES) {
    if (!EDUCATIONAL_MISSIONS.some(mission => mission.npcId === profile.id)) errors.push(profile.id + ": NPC profile has no associated mission/dialogue");
    if (!NPC_PERSPECTIVES[profile.id]) errors.push(profile.id + ": missing character-diversity metadata");
  }
  for (const concept of EDUCATIONAL_CONCEPTS) {
    if (!EDUCATIONAL_MISSIONS.some(mission => mission.conceptId === concept.id)) errors.push(concept.id + ": educational concept has no associated mission");
    for (const sector of concept.sectors || []) if (!sectorToId(sector)) errors.push(concept.id + ": sector has no registry mapping: " + sector);
    for (const prerequisite of concept.prerequisites || []) if (!conceptIds.has(prerequisite)) errors.push(concept.id + ": invalid prerequisite concept " + prerequisite);
  }
  for (const dialogue of KITCITY_DIALOGUES) {
    if (!NPC_REGISTRY.some(npc => npc.id === dialogue.npcId && npc.dialogueIds.includes(dialogue.id))) errors.push(dialogue.id + ": NPC references missing dialogue association for " + dialogue.npcId);
  }
  for (const content of [...KITCITY_DIALOGUES, ...EDUCATIONAL_MISSIONS]) {
    if (content.requires?.completedMission && !knownMissionRefs.has(content.requires.completedMission)) errors.push(content.id + ": invalid required mission " + content.requires.completedMission);
    for (const requiredMission of content.requires?.completedMissions || []) if (!knownMissionRefs.has(requiredMission)) errors.push(content.id + ": invalid required mission " + requiredMission);
    if (!content.start || !content.nodes?.[content.start]) errors.push(content.id + ": missing valid start node");
    const reachable = graphReachable(content);
    for (const nodeId of Object.keys(content.nodes || {})) if (!reachable.has(nodeId)) errors.push(content.id + ": unreachable dialogue node " + nodeId);
    for (const [nodeId, node] of Object.entries(content.nodes || {})) {
      for (const choice of node.choices || []) {
        for (const target of allEdges(content, {choices:[choice]})) if (!content.nodes[target]) errors.push(content.id + "/" + nodeId + ": invalid next node " + target);
      }
    }
  }
  return errors;
}

export function getDevelopmentReport() {
  const jurisdictionIdsWithLocations = new Set(WORLD_LOCATIONS.map(location => location.jurisdictionId));
  const jurisdictionIdsWithPlayableLocations = new Set(WORLD_LOCATIONS.filter(location => location.status === "playable").map(location => location.jurisdictionId));
  return {
    states: NIGERIAN_STATES.length,
    territories: NIGERIAN_TERRITORIES.length,
    jurisdictions: NIGERIAN_JURISDICTIONS.length,
    configuredLocations: WORLD_LOCATIONS.length,
    plannedLocations: WORLD_LOCATIONS.filter(item => item.status === "planned").length,
    settlementRecords: PLANNED_SETTLEMENT_LOCATIONS.length,
    registryOnlyLocations: WORLD_LOCATIONS.filter(item => item.status === "planned").length,
    playableLocations: WORLD_LOCATIONS.filter(item => item.status === "playable").length,
    jurisdictionsWithLocationRecords: jurisdictionIdsWithLocations.size,
    jurisdictionsWithPlayableLocations: jurisdictionIdsWithPlayableLocations.size,
    jurisdictionsAwaitingPlayableEnvironment: NIGERIAN_JURISDICTIONS.length - jurisdictionIdsWithPlayableLocations.size,
    locationsByStatus: WORLD_LOCATIONS.reduce((counts, location) => {
      counts[location.status] = (counts[location.status] || 0) + 1;
      return counts;
    }, {}),
    sectors: SECTOR_REGISTRY.length,
    environmentAssets: ENVIRONMENT_ASSET_REGISTRY.length,
    availableEnvironmentAssets: ENVIRONMENT_ASSET_REGISTRY.filter(asset => asset.status === "available").length,
    npcProfiles: NPC_REGISTRY.length,
    npcSpawnPoints: WORLD_LOCATIONS.reduce((count, location) => count + (location.npcSpawnPoints || []).length, 0),
    rewards: REWARD_REGISTRY.length,
    educationalConcepts: EDUCATIONAL_CONCEPTS.length,
    educationalMissions: EDUCATIONAL_MISSIONS.length,
    dialogueTrees: DIALOGUE_REGISTRY.length,
    locationEvents: LOCATION_EVENT_REGISTRY.length,
    missionsWithPlayableLocation: MISSION_DISTRIBUTION.filter(item => item.locationIds.some(id => WORLD_LOCATIONS.some(location => location.id === id && location.status === "playable"))).length,
    missionsAwaitingEnvironment: MISSION_DISTRIBUTION.filter(item => item.status === "authored-awaiting-environment").length
  };
}
