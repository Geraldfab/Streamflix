const { execSync } = require('child_process');

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
    env: { ...process.env, SKIP_WRANGLER_CONFIG_CHECK: 'yes' }
  });
} else {
  console.log('🔨 Building Next.js locally (Windows)...');
  execSync('npx next build', {
    stdio: 'inherit'
  });
}
