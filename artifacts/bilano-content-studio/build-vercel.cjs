const { execSync } = require('child_process');

console.log('>>> [Bilano Studio] Running vite build...');
execSync('npx vite build --config vite.config.ts', {
  cwd: __dirname,
  stdio: 'inherit',
});
console.log('>>> [Bilano Studio] Build completed successfully!');
