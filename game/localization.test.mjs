import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const moduleSource = await readFile(new URL('./localization.js', import.meta.url), 'utf8');
const encoded = encodeURIComponent(moduleSource).replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29');
const { SUPPORTED_LANGUAGES, translateText, translateHTML, auditLocalization } =
  await import('data:text/javascript;charset=utf-8,' + encoded);

test('only English and Naija Pidgin are available', () => {
  assert.deepEqual(Object.keys(SUPPORTED_LANGUAGES), ['en', 'pcm']);
  assert.equal(SUPPORTED_LANGUAGES.en, 'English');
  assert.equal(SUPPORTED_LANGUAGES.pcm, 'Naija Pidgin');
});

test('Pidgin translates core controls and major headings', () => {
  assert.equal(translateText('Choose how the game talks to you.', 'pcm'), 'Choose how the game go dey talk to you.');
  assert.notEqual(translateText('THE FIRST PROMISE', 'pcm'), 'THE FIRST PROMISE');
  assert.notEqual(translateText('MISSION UNLOCKED', 'pcm'), 'MISSION UNLOCKED');
  assert.notEqual(translateText('YOUR THOUGHTS', 'pcm'), 'YOUR THOUGHTS');
  assert.equal(translateText('MISSIONS COMPLETED', 'pcm'), 'MISSIONS DON COMPLETE');
  assert.equal(translateText('Address copied', 'pcm'), 'Address don copy');
  assert.equal(translateText('Share on WhatsApp', 'pcm'), 'Share am for WhatsApp');
  assert.equal(translateText('Settings', 'en'), 'Settings');
});

test('unsupported or legacy language codes safely fall back to English copy', () => {
  assert.equal(translateText('Settings', 'ha'), 'Settings');
  assert.equal(translateText('A new phrase', 'pcm'), 'A new phrase');
  assert.equal(translateText('Settings', 'en'), 'Settings');
});

test('Pidgin covers all story mission titles, goals, tasks and evidence copy', async () => {
  const source = await readFile(new URL('./lost-value-story.js', import.meta.url), 'utf8');
  const phrases = [...source.matchAll(/\b(title|goal|task|evidenceTitle|evidenceBody):\s*'((?:\\.|[^'\\])*)'/g)]
    .map(match => match[2].replace(/\\'/g, "'").trim()).filter(Boolean);
  assert.ok(phrases.length >= 75, 'expected mission metadata for the full story registry');
  const report = auditLocalization(phrases, 'pcm');
  assert.deepEqual(report.missing, [], 'Pidgin is missing mission metadata translations');
});

test('Pidgin covers every dialogue line in the full story registry', async () => {
  const source = await readFile(new URL('./lost-value-story.js', import.meta.url), 'utf8');
  const blocks = [...source.matchAll(/dialogue:\s*\[([\s\S]*?)\n\s*\],/g)];
  assert.ok(blocks.length >= 15, 'expected dialogue blocks across the complete story registry');
  const phrases = blocks.flatMap(block =>
    [...block[1].matchAll(/\[['"](?:\\.|[^'\\])*['"]\s*,\s*'((?:\\.|[^'\\])*)'\]/g)]
      .map(match => match[1].replace(/\\'/g, "'").trim()).filter(Boolean)
  );
  assert.ok(phrases.length >= 150, 'expected all dialogue lines, not just the first few missions');
  const report = auditLocalization(phrases, 'pcm');
  assert.deepEqual(report.missing, [], 'Pidgin is missing one or more mission conversation lines');
});

test('Pidgin covers the opening cinematic and its choices', async () => {
  const source = await readFile(new URL('./story-scene-director.js', import.meta.url), 'utf8');
  const phrases = [...source.matchAll(/\b(?:kicker|caption|text|label):\s*'((?:\\.|[^'\\])*)'/g)]
    .map(match => match[1].replace(/\\'/g, "'").trim()).filter(Boolean);
  assert.ok(phrases.length >= 15, 'expected opening cinematic text and choice labels');
  const report = auditLocalization(phrases, 'pcm');
  assert.deepEqual(report.missing, [], 'Pidgin is missing opening cinematic translations');
});

test('HTML translation preserves markup and only translates known text', () => {
  assert.equal(translateHTML('<button>Settings</button>', 'pcm'), '<button>Settings</button>');
  assert.equal(
    translateHTML('<p>Choose how the game talks to you.</p><span>Unknown label</span>', 'pcm'),
    '<p>Choose how the game go dey talk to you.</p><span>Unknown label</span>'
  );
});

test('coverage audit reports missing Pidgin phrases instead of claiming completeness', () => {
  const report = auditLocalization(['Choose how the game talks to you.', 'Never catalogued phrase'], 'pcm');
  assert.equal(report.total, 2);
  assert.equal(report.translated, 1);
  assert.equal(report.percent, 50);
  assert.deepEqual(report.missing, ['Never catalogued phrase']);
});
