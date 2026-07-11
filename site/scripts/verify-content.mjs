import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const profile = await readFile(new URL('../src/data/profile.ts', import.meta.url), 'utf8');
assert.match(profile, /nameZh:\s*['"]佐坤['"]/);
assert.doesNotMatch(profile, /左坤|ATER|Orléans/);
console.log('content contract: PASS');
