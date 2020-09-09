const path = require('path');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const pkg = require('./package.json');
const { terser } = require('rollup-plugin-terser');
const commonjs = require('@rollup/plugin-commonjs');

const resolve = (...args) => path.resolve(__dirname, ...args);

const extensions = ['.js', '.ts'];
const iifeSharedOutput = { format: 'iife', name: 'rxlize', globals: { rxjs: 'rxjs' } };

module.exports = {
  external: ['rxjs'],
  input: resolve('./src/index.ts'),
  output: [
    { file: resolve(pkg.module), format: 'es', sourcemap: true },
    { file: resolve(pkg.main), format: 'cjs', sourcemap: true },
    {
      file: resolve('dist/iife/rxlize.js'),
      ...iifeSharedOutput,
      sourcemap: 'inline',
    },
    {
      file: resolve('dist/iife/rxlize.min.js'),
      ...iifeSharedOutput,
      plugins: [terser()],
    },
  ],
  plugins: [
    commonjs(),
    nodeResolve({ extensions, moduleOnly: true }),
    babel({ exclude: ['node_modules/**'], extensions, babelHelpers: 'runtime' }),
  ],
};
