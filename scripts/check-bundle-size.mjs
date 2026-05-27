import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const budget = JSON.parse(readFileSync(join(dir, '..', 'performance-budget.json'), 'utf-8'));
const assets = join(dir, '..', 'dist', 'assets');

let total = 0;
const files = readdirSync(assets);

for (const f of files) {
  if (!f.endsWith('.js') || f.endsWith('.gz')) continue;
  const size = statSync(join(assets, f)).size;
  total += size;
  const limit = budget.maxBundleSize;
  if (size > limit) console.warn(`  ⚠ ${f}: ${(size / 1024).toFixed(1)} KB (limit: ${(limit / 1024).toFixed(1)} KB)`);
  else console.log(`  ✓ ${f}: ${(size / 1024).toFixed(1)} KB`);
}

console.log(`\nTotal JS: ${(total / 1024).toFixed(1)} KB`);
console.log(`Budget: ${(budget.maxBundleSize / 1024).toFixed(1)} KB`);
if (total > budget.maxBundleSize) {
  console.error(`\n✗ EXCEEDS BUDGET by ${((total - budget.maxBundleSize) / 1024).toFixed(1)} KB`);
  process.exit(1);
} else {
  console.log(`✓ Within budget (${((budget.maxBundleSize - total) / 1024).toFixed(1)} KB headroom)`);
}
