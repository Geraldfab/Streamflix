const { execSync } = require('child_process');

// Recursion guard: If called by OpenNext during its internal build step, run next build directly
if (process.env.NEXT_PRIVATE_STANDALONE === 'true' || process.env.OPEN_NEXT_BUILD === '1') {
  console.log('🔨 Building Next.js app (OpenNext internal step)...');
  execSync('npx next build', { stdio: 'inherit' });
  process.exit(0);
}

// Determine if we're running in Cloudflare CI / Linux build environment vs local Windows
const isCloudflare = Boolean(
  process.env.CF_PAGES ||
  process.env.CI ||
  process.env.CF_PAGES_COMMIT_SHA ||
  process.env.CLOUDFLARE_BUILD ||
  process.platform !== 'win32'
);

if (isCloudflare) {
  console.log('⚡ Building for Cloudflare Workers with OpenNext...');
  execSync('npx opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion', {
    stdio: 'inherit',
    env: {
      ...process.env,
      SKIP_WRANGLER_CONFIG_CHECK: 'yes',
      OPEN_NEXT_BUILD: '1'
    }
  });
} else {
  console.log('🔨 Building Next.js locally (Windows)...');
  execSync('npx next build', {
    stdio: 'inherit'
  });
}
