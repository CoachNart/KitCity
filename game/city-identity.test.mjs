import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('./kitcity-engine.js', import.meta.url), 'utf8');

test('all authored city identities retain a complete architectural and road profile', () => {
  const start = source.indexOf('const CITY_IDENTITY={');
  const end = source.indexOf('// State/metro aliases', start);
  assert.ok(start >= 0 && end > start, 'CITY_IDENTITY registry exists');
  const block = source.slice(start, end);
  const profiles = [...block.matchAll(/^\s{2}('[^']+'|[\w-]+):\{([^\n]+)\},?$/gm)];
  assert.ok(profiles.length >= 45, `expected at least 45 authored city profiles, found ${profiles.length}`);
  const signatures = new Set();
  for (const [, rawKey, body] of profiles) {
    for (const field of ['form:', 'road:', 'styles:', 'height:', 'feature:']) {
      assert.ok(body.includes(field), `${rawKey} is missing ${field}`);
    }
    signatures.add(body.trim());
  }
  assert.ok(signatures.size >= 35, `too many city profiles share the same signature (${signatures.size})`);
});

test('legacy palette pass cannot overwrite authored city identity', () => {
  assert.ok(!source.includes('function modernizeCityVisuals'), 'the palette-flattening pass is removed');
  const start = source.indexOf('function applyLook(key,C)');
  const end = source.indexOf('function atmoSet(', start);
  assert.ok(start >= 0 && end > start, 'applyLook exists');
  const applyLook = source.slice(start, end);
  assert.ok(applyLook.includes('paint:C.paint'), 'city paint feeds the look');
  assert.ok(applyLook.includes('ground:C.ground'), 'city ground feeds the look');
  assert.ok(applyLook.includes('slab:C.slab'), 'city paving feeds the look');
  assert.ok(!applyLook.includes('Object.assign(C,'), 'look presets do not overwrite city identity');
});

test('street layouts are profile-driven rather than one universal painted grid', () => {
  assert.ok(source.includes('function secondaryRoadAxis(C,i,j)'), 'city form drives secondary road directions');
  assert.ok(source.includes('const sparse=') && source.includes('const broken='), 'road-edge patterns vary by city form');
  assert.ok(source.includes('const formal=') && source.includes('const industrial=') && source.includes('const market='), 'block hardscape varies by city form');
  assert.ok(!source.includes('for(let k=-3;k<=3;k++)for(let i=-3;i<=2;i++){\n    const h=new THREE.Mesh(dashGeo,dashMat)'), 'universal dashed cross-grid is removed');
});

test('waterfront cities use different signature landmark families', () => {
  assert.ok(source.includes("if(form==='confluence')"), 'river confluence landmark exists');
  assert.ok(source.includes("else if(form==='creek-town')"), 'creek-town landmark exists');
  assert.ok(source.includes("else if(form==='delta-port'||form==='oil-port')"), 'industrial port landmark exists');
  assert.ok(source.includes('stilt homes'), 'creek-town landmarks include raised homes');
  assert.ok(source.includes('pipe runs and tank silhouettes'), 'port landmarks include industrial structures');
});

test('city-specific architecture details exist beyond palette changes', () => {
  for (const form of ['colonial-coast', 'heritage', 'dense-market', 'southeast-market', 'delta-port', 'oil-port', 'rail-crossroads', 'hillside', 'green-hills', 'rock-city', 'historic', 'sahel']) {
    assert.ok(source.includes(`form==='${form}'`) || source.includes(`form===' ${form}'`), `architecture rule for ${form} exists`);
  }
  assert.ok(source.includes('const porchD='), 'heritage veranda details exist');
  assert.ok(source.includes('const awning='), 'market awnings exist');
  assert.ok(source.includes('const ventColor='), 'port and rail roof details exist');
  assert.ok(source.includes('const parapet='), 'historic parapets exist');
});


test('fictional world branding stays neutral', async () => {
  const layout = await readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  const manifest = await readFile(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8');
  assert.match(layout, /fictional open world/i);
  assert.match(manifest, /fictional open world/i);
  assert.doesNotMatch(layout + manifest, /Nigeria|Nigerian|Naija/i);
});


test('fictional world uses abstract map coordinates and neutral street data', () => {
  assert.ok(source.includes('const WORLD_SHAPE='), 'the map uses a fictional landmass');
  assert.ok(source.includes('Map positions are fictional world coordinates'), 'real-world map coordinates are not used at runtime');
  assert.ok(source.includes('const FICTIONAL_ROADS='), 'street names are neutralized');
  assert.ok(source.includes('const FICTIONAL_DISTRICTS='), 'district names are neutralized');
  assert.ok(source.includes("const KEY='kitcity_world_v2'"), 'new saves use the fictional-world namespace');
  assert.ok(source.includes('LEGACY_CURRENCY_FIELD'), 'legacy balances have a migration path');
  assert.doesNotMatch(source, /CITIES\\.(?:lagos|abuja|kano|ibadan|enugu|kaduna|maiduguri|owerri|calabar|jos)\\b/i);
});

test('transport and fabric implementation use neutral internal names', () => {
  assert.doesNotMatch(source, /buildDanfo|buildKeke|buildOkada|ankaraMat|\\bANK\\b/i);
  assert.ok(source.includes('function buildShuttle('), 'minibus transport uses a neutral shuttle name');
  assert.ok(source.includes('function buildThreeWheeler('), 'three-wheeler transport uses a neutral name');
  assert.ok(source.includes('function buildMotorbike('), 'motorbike transport uses a neutral name');
  assert.ok(source.includes('function patternedFabricMat('), 'fabric patterns use a neutral name');
});

test('ambient soundtrack fallback cannot dereference a missing queue', () => {
  assert.ok(
    source.includes("MUSIC_QUEUES[currentKey]||MUSIC_QUEUES.ambient"),
    'currentLabel falls back to the always-defined ambient queue'
  );
  assert.ok(
    !source.includes("MUSIC_QUEUES[currentKey]||MUSIC_QUEUES.afrobeat"),
    'currentLabel does not fall back to a removed queue'
  );
});
