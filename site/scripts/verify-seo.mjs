import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for (const file of ['index.html', 'rss.xml', 'sitemap.xml', 'robots.txt']) {
  await readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8');
}

const home = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.match(home, /application\/ld\+json/);
assert.match(home, /rel="canonical"/);

const rss = await readFile(new URL('../dist/rss.xml', import.meta.url), 'utf8');
assert.match(rss, /<rss version="2\.0">/);
assert.equal((rss.match(/<item>/g) ?? []).length, 50);

const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
assert.equal((sitemap.match(/<url>/g) ?? []).length, 149);
assert.match(decodeURIComponent(sitemap), /https:\/\/alainouyang\.github\.io\/git指令整理\//);

const robots = await readFile(new URL('../dist/robots.txt', import.meta.url), 'utf8');
assert.match(robots, /Sitemap: https:\/\/alainouyang\.github\.io\/sitemap\.xml/);
console.log('seo contract: PASS');
