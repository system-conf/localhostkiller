/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild');

const watch = process.argv.includes('--watch');

const common = {
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  external: ['electron'],
  sourcemap: true,
  minify: !watch,
  logLevel: 'info',
};

const targets = [
  { ...common, entryPoints: ['src/main/main.ts'], outfile: 'dist-main/main/main.js' },
  { ...common, entryPoints: ['src/preload/preload.ts'], outfile: 'dist-main/preload/preload.js' },
];

async function main() {
  if (watch) {
    const contexts = await Promise.all(targets.map((opts) => esbuild.context(opts)));
    await Promise.all(contexts.map((c) => c.watch()));
    console.log('[esbuild] watching main + preload...');
  } else {
    await Promise.all(targets.map((opts) => esbuild.build(opts)));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
