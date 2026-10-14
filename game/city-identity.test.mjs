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

test('city-specific architecture details exist beyond palette changes', () => {
  for (const form of ['colonial-coast', 'heritage', 'dense-market', 'southeast-market', 'delta-port', 'oil-port', 'rail-crossroads', 'hillside', 'green-hills', 'rock-city', 'historic', 'sahel']) {
    assert.ok(source.includes(`form==='${form}'`) || source.includes(`form===' ${form}'`), `architecture rule for ${form} exists`);
  }
  assert.ok(source.includes('const porchD='), 'heritage veranda details exist');
  assert.ok(source.includes('const awning='), 'market awnings exist');
  assert.ok(source.includes('const ventColor='), 'port and rail roof details exist');
  assert.ok(source.includes('const parapet='), 'historic parapets exist');
});
