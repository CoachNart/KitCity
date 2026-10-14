import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load the production module as ESM without changing the app's package type or
// relying on experimental Node flags that differ between local and Vercel builds.
const moduleSource = await readFile(new URL('./localization.js', import.meta.url), 'utf8');
const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(moduleSource).toString('base64');
const {
  SUPPORTED_LANGUAGES,
  translateText,
  translateHTML,
  auditLocalization,
} = await import(moduleUrl);

test('all supported language codes are present', () => {
  assert.deepEqual(Object.keys(SUPPORTED_LANGUAGES), ['en', 'pcm', 'ha', 'yo', 'ig']);
});

test('reviewed UI phrases translate for each supported language', () => {
  const expected = {
    pcm: 'Settings',
    ha: 'Saituna',
    yo: 'Ètò',
    ig: 'Ntọala',
  };
  for (const [language, translation] of Object.entries(expected)) {
    assert.equal(translateText('Settings', language), translation);
    assert.notEqual(translateText('No wallet yet', language), 'No wallet yet');
  }
});

test('translation preserves whitespace and leaves unknown phrases safe', () => {
  assert.equal(translateText('  Settings  ', 'ha'), '  Saituna  ');
  assert.equal(translateText('A newly added mission line', 'yo'), 'A newly added mission line');
  assert.equal(translateText('Settings', 'en'), 'Settings');
  assert.equal(translateText('Settings', 'unsupported'), 'Settings');
});

test('opening cinematic dialogue is translated for all four non-English languages', () => {
  const source = 'So this T3Kit thing connects all these people?';
  const line = 'Another day. Another transaction. Another promise of something better.';
  for (const language of ['pcm', 'ha', 'yo', 'ig']) {
    assert.notEqual(translateText(source, language), source, language);
    assert.notEqual(translateText(line, language), line, language);
  }
});

test('mission objectives and evidence records are catalogued in every supported language', () => {
  const phrases = [
    'The First Promise',
    'Inspect the original promise noticeboard and return to Softstorm.',
    'Thousands of future users. Major partnerships. Guaranteed community rewards. Verified work: insufficient evidence.',
  ];
  for (const language of ['pcm', 'ha', 'yo', 'ig']) {
    for (const phrase of phrases) {
      assert.notEqual(translateText(phrase, language), phrase, language + ': ' + phrase);
    }
  }
});

test('HTML translation changes text nodes only and keeps markup intact', () => {
  assert.equal(translateHTML('<button>Settings</button>', 'ha'), '<button>Saituna</button>');
  assert.equal(
    translateHTML('<p>Settings</p><span class="tag">No wallet yet</span>', 'yo'),
    '<p>Ètò</p><span class="tag">O kò tíì ní àpò owó</span>'
  );
  assert.equal(translateHTML('<a href="/settings">Unknown label</a>', 'ig'), '<a href="/settings">Unknown label</a>');
});

test('coverage audit reports missing phrases instead of silently claiming completeness', () => {
  const report = auditLocalization(['Settings', 'No wallet yet', 'New dialogue never catalogued'], 'ha');
  assert.equal(report.total, 3);
  assert.equal(report.translated, 2);
  assert.equal(report.percent, 67);
  assert.deepEqual(report.missing, ['New dialogue never catalogued']);
});
