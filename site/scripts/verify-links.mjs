import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? collectHtml(target) : entry.name.endsWith('.html') ? [target] : [];
  }));
  return nested.flat();
}

async function exists(target) {
  try { await access(target); return true; } catch { return false; }
}

const missing = [];
for (const file of await collectHtml(dist)) {
  const html = await readFile(file, 'utf8');
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (!reference.startsWith('/') || reference.startsWith('//')) continue;
    const pathname = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
    if (!pathname) continue;
    const relative = pathname.replace(/^\//, '');
    const candidates = pathname.endsWith('/')
      ? [path.join(dist, relative, 'index.html')]
      : [path.join(dist, relative), path.join(dist, relative, 'index.html')];
    if (!(await Promise.all(candidates.map(exists))).some(Boolean)) {
      missing.push(`${path.relative(dist, file)} -> ${pathname}`);
    }
  }
}

assert.deepEqual([...new Set(missing)].sort(), []);
console.log('internal link contract: PASS');
