import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for (const file of ['BaseLayout.astro', 'SiteHeader.astro', 'SiteFooter.astro', 'PageIntro.astro', 'SectionHeading.astro']) {
  const folder = file === 'BaseLayout.astro' ? 'layouts' : 'components';
  await readFile(new URL(`../src/${folder}/${file}`, import.meta.url), 'utf8');
}

const tokens = await readFile(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
for (const token of ['--color-bg', '--color-surface', '--color-text', '--color-accent', '--radius-card', '--content-width']) {
  assert.match(tokens, new RegExp(token));
}

console.log('design system contract: PASS');
