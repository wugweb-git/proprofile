import fs from 'node:fs';

const requiredFiles = ['vercel.json', 'api/health.ts', 'api/memory.ts', 'api/_lib/mongodb.ts'];
const missing = requiredFiles.filter((f) => !fs.existsSync(f));

if (missing.length > 0) {
  console.error('[vercel-check] FAIL: Missing files:', missing.join(', '));
  process.exit(1);
}

const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const rewrites = Array.isArray(vercelConfig.rewrites) ? vercelConfig.rewrites : [];
const hasSpaRewrite = rewrites.some(
  (rule) => typeof rule.source === 'string' && rule.source.includes('(?!api/)') && rule.destination === '/index.html',
);

if (!hasSpaRewrite) {
  console.error('[vercel-check] FAIL: SPA rewrite excluding /api/* not found.');
  process.exit(1);
}

console.log('[vercel-check] PASS: Required API files exist and SPA rewrite is configured.');
