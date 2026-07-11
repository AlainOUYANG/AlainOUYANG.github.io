import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const source = fileURLToPath(new URL('../../_posts/', import.meta.url));
const target = fileURLToPath(new URL('../src/content/posts/', import.meta.url));

function field(raw, name) {
  const value = raw.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim();
  if (!value) return undefined;
  if (value.startsWith('"') && value.endsWith('"')) {
    try { return JSON.parse(value); } catch { return value.slice(1, -1); }
  }
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
  return value;
}

function legacySlug(filename) {
  return filename
    .replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '')
    .replace(/\.md$/, '')
    .normalize('NFKC')
    .toLocaleLowerCase('en-US')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

await mkdir(target, { recursive: true });
const names = (await readdir(source)).filter((name) => name.endsWith('.md')).sort();

for (const name of names) {
  const raw = await readFile(path.join(source, name), 'utf8');
  const date = name.match(/^(\d{4})-(\d{1,2})-(\d{1,2})-/);
  if (!date) throw new Error(`Invalid post filename: ${name}`);

  const fallbackTitle = name.replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '').replace(/\.md$/, '');
  const title = field(raw, 'title') ?? fallbackTitle;
  const description = field(raw, 'subtitle') ?? title;
  const pubDate = `${date[1]}-${date[2].padStart(2, '0')}-${date[3].padStart(2, '0')}`;
  const permalink = `/${legacySlug(name)}/`;
  const body = raw.replace(/^---\s*[\s\S]*?\n---\s*/, '');
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `pubDate: ${pubDate}`,
    `permalink: ${JSON.stringify(permalink)}`,
    'category: 历史归档',
    'featured: false',
    'draft: false',
    '---',
    ''
  ].join('\n');

  const targetName = name.replace(/[?#]/g, '-');
  await writeFile(path.join(target, targetName), `${frontmatter}\n${body.trimStart()}`, 'utf8');
}

console.log(`migrated ${names.length} posts`);
