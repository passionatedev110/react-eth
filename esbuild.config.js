const esbuild = require('esbuild');
// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild
  .build({
    entryPoints: [
      './src/index.ts',
      './src/ant/index.ts',
      './src/ant/generic-contract/index.ts',
      './src/functions/index.ts',
      './src/models/index.ts',
    ],
    outdir: 'lib',
    bundle: true,
    minify: true,
    platform: 'browser',
    sourcemap: true,
    target: ['node14', 'esnext'],
    splitting: true,
    format: 'esm',
    inject: ['esbuild.shim.js'],
    plugins: [nodeExternalsPlugin()],
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
