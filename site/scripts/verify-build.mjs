import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

await access(new URL('../dist/index.html', import.meta.url));
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
assert.match(html, /佐坤/);
assert.match(html, /研究增量，也创造新东西/);
console.log('build contract: PASS');
