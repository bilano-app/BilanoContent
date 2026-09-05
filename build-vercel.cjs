const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const studioDir = path.resolve(rootDir, 'artifacts', 'bilano-content-studio');

console.log('>>> [Vercel Build] Building Vite Studio in:', studioDir);
execSync('npx vite build --config vite.config.ts', {
  cwd: studioDir,
  stdio: 'inherit',
});

const studioDist = path.resolve(studioDir, 'dist');
const rootDist = path.resolve(rootDir, 'dist');

console.log('>>> [Vercel Build] Syncing dist folders...');
if (fs.existsSync(studioDist)) {
  fs.cpSync(studioDist, rootDist, { recursive: true, force: true });
}

console.log('>>> [Vercel Build] Verification:');
console.log(' - Root dist/index.html:', fs.existsSync(path.join(rootDist, 'index.html')));
console.log(' - Studio dist/index.html:', fs.existsSync(path.join(studioDist, 'index.html')));
console.log('>>> [Vercel Build] ALL DONE SUCCESSFULLY!');
