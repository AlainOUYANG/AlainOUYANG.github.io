import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = path.join(root, 'src');
const sourceFiles = [];

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!['content', 'assets'].includes(entry.name)) await collect(target);
    } else if (/\.(?:astro|ts)$/.test(entry.name) && !target.endsWith('data/publications.ts')) {
      sourceFiles.push(target);
    }
  }
}

await collect(sourceRoot);
const characters = new Set();
for (const file of sourceFiles) {
  for (const character of await readFile(file, 'utf8')) {
    if (character.codePointAt(0) > 0x2ff) characters.add(character.codePointAt(0));
  }
}

const input = await readFile(path.join(root, 'node_modules/lxgw-wenkai-webfont/lxgwwenkai-regular.css'), 'utf8');
const blocks = input.match(/\/\*[^]*?@font-face\s*\{[^]*?\}/g) ?? [];
const selected = blocks.filter((block) => {
  const ranges = block.match(/U\+[0-9a-f]+(?:-[0-9a-f]+)?/gi) ?? [];
  return ranges.some((range) => {
    const [start, end = start] = range.slice(2).split('-').map((value) => Number.parseInt(value, 16));
    return [...characters].some((codePoint) => codePoint >= start && codePoint <= end);
  });
}).map((block) => block
  .replaceAll("font-family: 'LXGW WenKai'", "font-family: 'LXGW WenKai UI'")
  .replaceAll("url('./files/", "url('../../node_modules/lxgw-wenkai-webfont/files/"));

await writeFile(path.join(sourceRoot, 'styles/lxgw-wenkai-ui.css'), `${selected.join('\n')}\n`);
console.log(`ui font css: ${selected.length} subsets for ${characters.size} code points`);
