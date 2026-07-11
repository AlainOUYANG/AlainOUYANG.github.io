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
assert.match(tokens, /--font-latin:\s*"Source Sans 3 Variable"/);
assert.match(tokens, /--font-cjk:\s*"LXGW WenKai"/);
assert.doesNotMatch(tokens, /gradient-accent|accent-violet|shadow-card/);

const globalCss = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
assert.match(globalCss, /font-synthesis:\s*none/);
assert.doesNotMatch(globalCss, /radial-gradient|fractalNoise/);

for (const file of ['TopicCard.astro', 'ArticleCard.astro', 'LabCard.astro']) {
  const source = await readFile(new URL(`../src/components/${file}`, import.meta.url), 'utf8');
  assert.match(source, /data-editorial-row/);
  assert.doesNotMatch(source, /surface-card|min-height:\s*(?:19|20|21|22|25|28)rem|gradient/);
}

console.log('design system contract: PASS');
