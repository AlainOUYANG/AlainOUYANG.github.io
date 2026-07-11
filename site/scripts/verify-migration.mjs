import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directory = fileURLToPath(new URL('../src/content/posts/', import.meta.url));
const files = (await readdir(directory)).filter((file) => file.endsWith('.md'));
assert.equal(files.length, 142);

const permalinks = new Set();
for (const file of files) {
  const content = await readFile(path.join(directory, file), 'utf8');
  const permalink = content.match(/^permalink:\s*"([^"]+)"/m)?.[1];
  assert.ok(permalink, `${file} must declare permalink`);
  const slug = file
    .replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '')
    .replace(/\.md$/, '')
    .normalize('NFKC')
    .toLocaleLowerCase('en-US')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  assert.equal(permalink, `/${slug}/`, `${file} must preserve its legacy title-only route`);
  assert.ok(!permalinks.has(permalink), `duplicate permalink: ${permalink}`);
  permalinks.add(permalink);
}

assert.ok(permalinks.has('/git指令整理/'));
const manifest = JSON.parse(await readFile(new URL('../data/legacy-url-manifest.json', import.meta.url), 'utf8'));
assert.equal(manifest.length, 142);
assert.deepEqual(new Set(manifest.map((entry) => entry.permalink)), permalinks);
const publications = await readFile(new URL('../src/data/publications.ts', import.meta.url), 'utf8');
assert.doesNotMatch(publications, /Paper Title Number|Journal 1|paper[123]\.pdf/);
console.log('migration contract: PASS');
