import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const engine = await readFile(new URL('./kitcity-engine.js', import.meta.url), 'utf8');

function section(startMarker, endMarker) {
  const start = engine.indexOf(startMarker);
  assert.notEqual(start, -1, `Missing section: ${startMarker}`);
  const end = engine.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `Missing end marker: ${endMarker}`);
  return engine.slice(start, end);
}

test('game engine parses as JavaScript without executing browser/game code', () => {
  const start = engine.indexOf('export default function initKitCity');
  assert.notEqual(start, -1, 'Game entrypoint must exist');
  const body = engine.slice(start).replace(/^export default function initKitCity/m, 'function initKitCity');
  assert.doesNotThrow(() => new Function(body));
});

test('city road archetypes use multiple widths and block footprints', () => {
  const designs = section('const CITY_ROAD_DESIGNS={', '\n};\nfunction cityRoadDesign');
  const widths = [...designs.matchAll(/width:(\d+)/g)].map(match => Number(match[1]));
  const blockWidths = [...designs.matchAll(/blockW:(\d+)/g)].map(match => Number(match[1]));
  assert.ok(widths.length >= 15, 'Expected a broad set of road archetypes');
  assert.ok(new Set(widths).size >= 7, 'Road widths should vary by city form');
  assert.ok(new Set(blockWidths).size >= 7, 'Block sizes should vary by city form');
});

test('all expanded city records have a city-specific skyline signature', () => {
  const extras = section('const EXTRA_CITIES=', '\nEXTRA_CITIES.forEach');
  const extraKeys = [...extras.matchAll(/\["([^"]+)"/g)].map(match => match[1]);
  const signatures = section('const CITY_SIGNATURES={', '\n};\nfunction addCitySignature');
  const signatureKeys = new Set([...signatures.matchAll(/(?:^|[,\s])([a-z][a-z0-9-]*):'[^']+'/g)].map(match => match[1]));
  const missing = extraKeys.filter(key => !signatureKeys.has(key));
  assert.deepEqual(missing, [], 'Every expanded city needs a distinct signature profile');
});

test('city building and skyline renderers use the new profiles', () => {
  assert.ok(engine.includes('new THREE.BoxGeometry(design.blockW,.1,design.blockD)'));
  assert.ok(engine.includes('blocks.push({cx,cz,w:design.blockW,d:design.blockD})'));
  assert.ok(engine.includes('addCityIdentityFeature(C); addCitySignature(C)'));
  assert.ok(engine.includes('Regional horizons differ in silhouette and density'));
  assert.ok(engine.includes('const crossingStride=design.crossingStride||3'));
});

test('mission navigation anchors remain fixed during visual redesign', () => {
  assert.ok(engine.includes('const R=70;'));
  assert.ok(engine.includes('const SPAWN={x:9.5,z:-9.5};'));
  assert.ok(engine.includes("story:{x:125,z:-185,f:1}"));
  assert.ok(engine.includes("lvG:{x:190,z:0,f:-1}"));
});
