import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for (const file of ['BaseLayout.astro', 'SiteHeader.astro', 'SiteFooter.astro', 'PageIntro.astro', 'SectionHeading.astro']) {
  const folder = file === 'BaseLayout.astro' ? 'layouts' : 'components';
  await readFile(new URL(`../src/${folder}/${file}`, import.meta.url), 'utf8');
}

const tokens = await readFile(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
for (const token of ['--color-bg', '--color-surface', '--color-text', '--color-accent', '--content-width', '--reading-width']) {
  assert.match(tokens, new RegExp(token));
}
assert.match(tokens, /color-scheme:\s*light/);
assert.match(tokens, /--font-latin:\s*"Source Sans 3 Variable";/);
assert.match(tokens, /--font-cjk:\s*"LXGW WenKai UI";/);
assert.match(tokens, /--font-cjk-full:\s*"LXGW WenKai";/);
assert.match(tokens, /--font-body:\s*var\(--font-latin\),\s*var\(--font-cjk\),/);
assert.match(tokens, /--color-subtle:\s*#6f6b62/);
assert.doesNotMatch(tokens, /gradient-accent|accent-violet|shadow-card/);

const globalCss = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
assert.match(globalCss, /font-synthesis:\s*none/);
assert.doesNotMatch(globalCss, /radial-gradient|fractalNoise/);

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
assert.equal(packageJson.scripts.prebuild, 'npm run build:font-ui');

const baseLayout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
const articleLayout = await readFile(new URL('../src/layouts/ArticleLayout.astro', import.meta.url), 'utf8');
assert.doesNotMatch(baseLayout, /lxgw-wenkai-webfont/);
assert.match(articleLayout, /lxgw-wenkai-webfont\/lxgwwenkai-regular\.css/);
const uiFontCss = await readFile(new URL('../src/styles/lxgw-wenkai-ui.css', import.meta.url), 'utf8');
assert.match(uiFontCss, /font-family:\s*['"]LXGW WenKai UI['"]/);
assert.ok((uiFontCss.match(/@font-face/g) ?? []).length <= 20);

for (const file of ['TopicCard.astro', 'ArticleCard.astro', 'LabCard.astro']) {
  const source = await readFile(new URL(`../src/components/${file}`, import.meta.url), 'utf8');
  assert.match(source, /data-editorial-row/);
  assert.doesNotMatch(source, /surface-card|min-height:\s*(?:19|20|21|22|25|28)rem|gradient/);
}

console.log('design system contract: PASS');
