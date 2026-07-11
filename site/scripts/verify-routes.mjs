import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routes = [
  'topics/index.html',
  'writing/index.html',
  'lab/index.html',
  'research/index.html',
  'about/index.html',
  'archive/index.html',
  '404.html'
];

for (const route of routes) {
  const html = await readFile(new URL(`../dist/${route}`, import.meta.url), 'utf8');
  assert.match(html, /data-site-header/);
  assert.match(html, /data-page-intro/);
  assert.match(html, /data-section-heading/);
  assert.match(html, /Kzyo/);
  assert.doesNotMatch(html, /gradient-accent|data-particle-hero|profile\.png/);
  if (route !== 'research/index.html') {
    assert.doesNotMatch(html, /佐坤|Zuokun Ouyang/);
  }
}

const about = await readFile(new URL('../dist/about/index.html', import.meta.url), 'utf8');
assert.doesNotMatch(about, /about-profile__monogram|<img/);

const research = await readFile(new URL('../dist/research/index.html', import.meta.url), 'utf8');
assert.match(research, /Zuokun Ouyang/);

console.log('route contract: PASS');
