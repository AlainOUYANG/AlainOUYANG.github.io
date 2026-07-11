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
}

console.log('route contract: PASS');
