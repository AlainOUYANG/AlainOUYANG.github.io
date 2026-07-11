import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

await access(new URL('../dist/index.html', import.meta.url));
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.match(html, /Kzyo/);
assert.match(html, /研究增长为何发生/);
assert.match(html, /data-home-intro/);
assert.match(html, /data-editorial-row/);
assert.match(html, /增长与因果/);
assert.match(html, /AI 项目/);
assert.doesNotMatch(html, /data-particle-hero|<canvas|bento-grid|profile\.png|佐坤|Zuokun Ouyang/);

const globalCss = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
assert.match(globalCss, /prefers-reduced-motion/);

const homeSource = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
assert.match(homeSource, /clamp\(2\.7rem,\s*13vw,\s*3\.25rem\)/);
console.log('build contract: PASS');
