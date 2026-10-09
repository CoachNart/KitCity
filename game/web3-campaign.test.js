import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  CAMPAIGN_BLUEPRINTS,
  CAMPAIGN_STAGES,
  REQUIRED_CAST,
  STREET_CITIES,
  awardCampaignJourney,
  canStartMission,
  isJourneyUnlocked,
  validateCampaign
} from "./web3-campaign.js";

test("the full street campaign covers all 38 later cities with two practical scenarios each", () => {
  assert.equal(CAMPAIGN_BLUEPRINTS.length, 76);
  assert.equal(STREET_CITIES.length, 38);
  assert.deepEqual(validateCampaign(), []);
  for (const city of STREET_CITIES) {
    const missions = CAMPAIGN_BLUEPRINTS.filter(m => m.city === city.id);
    assert.equal(missions.length, 2, city.id);
    assert.ok(missions.every(m => m.localName === city.name && m.site === city.site));
  }
});

test("campaign IDs are unique and the sequence continues after the original eight missions", () => {
  assert.equal(new Set(CAMPAIGN_BLUEPRINTS.map(m => m.id)).size, 76);
  assert.deepEqual(CAMPAIGN_BLUEPRINTS.map(m => m.number), Array.from({length:76}, (_,i)=>i+9));
  assert.equal(CAMPAIGN_BLUEPRINTS[0].id, "campaign_009");
  assert.equal(CAMPAIGN_BLUEPRINTS.at(-1).id, "campaign_084");
});

test("all ten learning stages are represented with accurate stage assignments", () => {
  assert.equal(CAMPAIGN_STAGES.length, 10);
  assert.deepEqual(CAMPAIGN_STAGES.map(s=>s.id), [1,2,3,4,5,6,7,8,9,10]);
  for (const mission of CAMPAIGN_BLUEPRINTS) {
    const stage=CAMPAIGN_STAGES.find(s=>mission.number>=s.first&&mission.number<=s.last);
    assert.ok(stage, mission.id);
    assert.equal(mission.stage, stage.id, mission.id);
  }
  for (const stage of CAMPAIGN_STAGES.slice(1)) assert.ok(CAMPAIGN_BLUEPRINTS.some(m=>m.stage===stage.id), stage.title);
});

test("every mandated character has a distinct role and is used in the campaign", () => {
  const expected=["Softstorm","IamAbdul","Joseph","Larai","Unique","Smrt huntr","Goodness","Semi","Blockqueen","Christol","Laloba","BigSam","LunaX","OxNight","Moon","The cryptonian","Joseph Nnadi","The don","Praise","Toza","Craftore","Kodavic","Cybersage","Reina","Cclya","Leemah","Kenny"];
  assert.deepEqual(REQUIRED_CAST.map(c=>c.name), expected);
  for (const character of REQUIRED_CAST) {
    assert.ok(character.role && character.style, character.name);
    assert.ok(CAMPAIGN_BLUEPRINTS.some(m=>m.character===character.name), character.name);
  }
});

test("missions introduce concepts before an actionable choice and provide safe recovery", () => {
  for (const mission of CAMPAIGN_BLUEPRINTS) {
    assert.ok(mission.title && mission.story && mission.concept && mission.teach && mission.challenge, mission.id);
    assert.ok(mission.choices.length>=3, mission.id);
    assert.ok(mission.correct>=0 && mission.correct<mission.choices.length, mission.id);
    assert.ok(mission.skill && mission.xp>0 && mission.difficulty, mission.id);
    assert.ok(mission.city && mission.localName && mission.localRole && mission.site, mission.id);
    assert.ok(mission.consequence && mission.recovery, mission.id);
    assert.doesNotMatch(JSON.stringify(mission), /https?:\/\//i, mission.id+" must not rely on an external task website");
  }
});

test("city journeys require starter completion and then the immediately previous journey", () => {
  const [first, second, third]=STREET_CITIES;
  assert.equal(isJourneyUnlocked(first.id, [], false), false);
  assert.equal(isJourneyUnlocked(first.id, [], true), true);
  assert.equal(isJourneyUnlocked(second.id, [], true), false);
  assert.equal(isJourneyUnlocked(second.id, ["ak_"+first.id], true), true);
  assert.equal(isJourneyUnlocked(third.id, ["ak_"+first.id], true), false);
  assert.equal(isJourneyUnlocked(third.id, ["ak_"+first.id,"ak_"+second.id], true), true);
  assert.equal(isJourneyUnlocked("unknown-city", [], true), false);
});

test("journey rewards update XP, KitCoins, skills, relationships and reputation only once", () => {
  const mission=CAMPAIGN_BLUEPRINTS[0];
  const journey={id:"ak_test-city",xp:90,blueprints:CAMPAIGN_BLUEPRINTS.slice(0,2)};
  const initial={xp:100,coins:5,reputation:1,done:{},skills:{},relationships:{}};
  const reward=awardCampaignJourney(initial,journey,20);
  assert.equal(reward.first,true);
  assert.equal(reward.xpGain,110);
  assert.equal(reward.coinGain,24);
  assert.equal(reward.player.xp,210);
  assert.equal(reward.player.coins,29);
  assert.equal(reward.player.reputation,3);
  assert.equal(reward.player.done["ak_test-city"],true);
  for (const bp of journey.blueprints) {
    assert.equal(reward.player.skills[bp.skill],1);
    assert.equal(reward.player.relationships[bp.character],1);
  }
  const repeat=awardCampaignJourney(reward.player,journey,20);
  assert.equal(repeat.first,false);
  assert.equal(repeat.xpGain,0);
  assert.equal(repeat.coinGain,0);
  assert.equal(repeat.player.xp,210);
  assert.equal(repeat.player.coins,29);
  assert.equal(canStartMission(CAMPAIGN_BLUEPRINTS[0],[]),true);
  assert.equal(canStartMission(CAMPAIGN_BLUEPRINTS[1],[]),false);
  assert.equal(canStartMission(CAMPAIGN_BLUEPRINTS[1],[CAMPAIGN_BLUEPRINTS[0].id]),true);
});

test("the live engine wires tested progression, persistence, recovery, side jobs and spendable rewards", async () => {
  const source=await readFile(new URL("./kitcity-engine.js", import.meta.url), "utf8");
  assert.match(source,/awardCampaignJourney\(P,m,G\.bonus\)/);
  assert.match(source,/isJourneyUnlocked\(city,Object\.keys\(P\.done\)/);
  assert.match(source,/if\(!m\|\|!isUnlocked\(m\)\)/);
  assert.match(source,/skills:P\.skills,relationships:P\.relationships,reputation:P\.reputation,coins:P\.coins,sideDone:P\.sideDone,jobCounts:P\.jobCounts,projects:P\.projects/);
  assert.match(source,/Hidden street discovery/);
  assert.match(source,/Repeatable street job/);
  assert.match(source,/data-a="fund"/);
  assert.match(source,/KITCITY HUB/);
  assert.doesNotMatch(source,/Open your X profile/);
});
