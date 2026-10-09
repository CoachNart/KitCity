import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CAMPAIGN_BLUEPRINTS,
  CAMPAIGN_STAGES,
  REQUIRED_CAST,
  STREET_CITIES,
  canStartMission,
  validateCampaign
} from './web3-campaign.js';

test('campaign has 76 playable street missions across all 38 later cities', () => {
  assert.equal(CAMPAIGN_BLUEPRINTS.length, 76);
  assert.equal(STREET_CITIES.length, 38);
  for (const city of STREET_CITIES) {
    const missions = CAMPAIGN_BLUEPRINTS.filter(m => m.city === city.id);
    assert.equal(missions.length, 2, city.id + ' should have two missions');
    assert.ok(missions.every(m => m.site === city.site && m.localName === city.name));
  }
});

test('mission IDs and sequence are unique and continuous from mission 9 to 84', () => {
  assert.equal(new Set(CAMPAIGN_BLUEPRINTS.map(m => m.id)).size, 76);
  assert.deepEqual(CAMPAIGN_BLUEPRINTS.map(m => m.number), Array.from({length: 76}, (_, i) => i + 9));
  assert.equal(CAMPAIGN_BLUEPRINTS[0].id, 'campaign_009');
  assert.equal(CAMPAIGN_BLUEPRINTS.at(-1).id, 'campaign_084');
});

test('all ten learning stages are represented in the intended order', () => {
  assert.equal(CAMPAIGN_STAGES.length, 10);
  assert.deepEqual(CAMPAIGN_STAGES.map(s => s.id), [1,2,3,4,5,6,7,8,9,10]);
  for (const mission of CAMPAIGN_BLUEPRINTS) {
    const stage = CAMPAIGN_STAGES.find(s => mission.number >= s.first && mission.number <= s.last);
    assert.ok(stage, mission.id + ' must belong to a stage');
    assert.equal(mission.stage, stage.id, mission.id + ' stage mismatch');
  }
});

test('every required character has a distinct role and is used in the implemented campaign', () => {
  assert.equal(REQUIRED_CAST.length, 27);
  assert.equal(new Set(REQUIRED_CAST.map(c => c.name)).size, 27);
  for (const character of REQUIRED_CAST) {
    assert.ok(character.role && character.style, character.name + ' needs a role and dialogue style');
    assert.ok(CAMPAIGN_BLUEPRINTS.some(m => m.character === character.name), character.name + ' must appear in a mission');
  }
});

test('each mission has a playable decision, recovery guidance, skill, reward and location', () => {
  for (const mission of CAMPAIGN_BLUEPRINTS) {
    assert.ok(mission.title && mission.story && mission.concept && mission.teach && mission.challenge, mission.id);
    assert.ok(mission.choices.length >= 3, mission.id + ' needs meaningful choices');
    assert.ok(mission.correct >= 0 && mission.correct < mission.choices.length, mission.id + ' has an invalid correct choice');
    assert.ok(mission.skill && mission.xp > 0 && mission.difficulty, mission.id + ' needs progression rewards');
    assert.ok(mission.city && mission.site && mission.localName && mission.localRole, mission.id + ' needs a location and local character');
    assert.ok(mission.consequence && mission.recovery, mission.id + ' needs mistake recovery');
    assert.ok(!/https?:\/\//i.test(JSON.stringify(mission)), mission.id + ' should not depend on an external task website');
  }
  assert.deepEqual(validateCampaign(), []);
});

test('prerequisites allow the first mission and prevent skipping the sequence', () => {
  const [first, second, third] = CAMPAIGN_BLUEPRINTS;
  assert.equal(canStartMission(first, []), true);
  assert.equal(canStartMission(second, []), false);
  assert.equal(canStartMission(second, [first.id]), true);
  assert.equal(canStartMission(third, [first.id]), false);
  assert.equal(canStartMission(third, [first.id, second.id]), true);
  assert.equal(canStartMission(null, []), false);
});
