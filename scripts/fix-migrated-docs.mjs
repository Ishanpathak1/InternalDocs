/**
 * Fix migrated SQL docs: decode HTML entities so content displays properly.
 * Run: node scripts/fix-migrated-docs.mjs
 * Optional: OVERWRITE=1 (default: dry run, prints what would change)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, '..', 'src', 'content', 'docs');

function decodeHtmlEntities(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, '\u00A0')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, '&'); // &amp; last to avoid double-decode
}

function hasEntities(str) {
  return /&(amp|lt|gt|quot|#39|apos|nbsp|#\d+|#x[0-9a-f]+);/i.test(str);
}

function fixFile(filepath) {
  const raw = readFileSync(filepath, 'utf8');
  const fmEnd = raw.indexOf('\n---\n', 4);
  if (fmEnd === -1) return { changed: false, raw };
  const frontmatter = raw.slice(0, fmEnd + 5);
  const body = raw.slice(fmEnd + 5);
  if (!hasEntities(body)) return { changed: false, raw };
  const fixedBody = decodeHtmlEntities(body);
  const fixed = frontmatter + fixedBody;
  return { changed: true, raw: fixed, original: raw };
}

const overwrite = process.env.OVERWRITE === '1';
const files = readdirSync(DOCS_DIR).filter((f) => f.endsWith('.md'));
let updated = 0;

for (const f of files) {
  const filepath = join(DOCS_DIR, f);
  const { changed, raw } = fixFile(filepath);
  if (changed) {
    updated++;
    if (overwrite) {
      writeFileSync(filepath, raw, 'utf8');
      console.log(`Fixed: ${f}`);
    } else {
      console.log(`Would fix: ${f}`);
    }
  }
}

if (!overwrite && updated > 0) {
  console.log(`\nRun with OVERWRITE=1 to apply changes.`);
}
console.log(`Done. ${updated} file(s) ${overwrite ? 'updated' : 'would be updated'}.`);
