import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const profile = await readFile(new URL('../src/data/profile.ts', import.meta.url), 'utf8');
assert.match(profile, /id:\s*['"]Kzyo['"]/);
assert.doesNotMatch(profile, /nameZh|nameEn|佐坤|左坤|Zuokun Ouyang|ATER|Orléans/);

for (const path of [
  'components/SEOHead.astro',
  'components/SiteHeader.astro',
  'components/SiteFooter.astro',
  'layouts/ArticleLayout.astro',
  'pages/index.astro',
  'pages/topics/index.astro',
  'pages/writing/index.astro',
  'pages/lab/index.astro',
  'pages/about/index.astro',
  'pages/archive/index.astro',
  'pages/rss.xml.ts'
]) {
  const source = await readFile(new URL(`../src/${path}`, import.meta.url), 'utf8');
  assert.doesNotMatch(source, /佐坤|左坤|Zuokun Ouyang/);
}

console.log('content contract: PASS');
