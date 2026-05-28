/* eslint-disable @typescript-eslint/no-var-requires */
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const root = path.resolve(__dirname, '..');
const VITE_PORT = 5179;

function run(cmd, args, env = {}) {
  const child = spawn(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...env },
  });
  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
  return child;
}

function waitForVite() {
  return new Promise((resolve) => {
    const tryOnce = () => {
      const req = http.get(`http://localhost:${VITE_PORT}`, () => resolve());
      req.on('error', () => setTimeout(tryOnce, 300));
    };
    tryOnce();
  });
}

(async () => {
  console.log('[dev] starting vite...');
  run('npx', ['vite']);
  await waitForVite();
  console.log('[dev] vite ready, building main...');
  await new Promise((resolve, reject) => {
    const tsc = spawn('npx', ['tsc', '-p', 'tsconfig.main.json'], {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    tsc.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`tsc exit ${code}`))));
  });
  console.log('[dev] launching electron...');
  run('npx', ['electron', '.'], {
    LHK_DEV_SERVER: `http://localhost:${VITE_PORT}`,
  });
})();
