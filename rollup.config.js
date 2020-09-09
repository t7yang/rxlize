const path = require('path');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const pkg = require('./package.json');
const { terser } = require('rollup-plugin-terser');
const commonjs = require('@rollup/plugin-commonjs');

const resolve = (...args) => path.resolve(__dirname, ...args);

const extensions = ['.js', '.ts'];

module.exports = {
  external: ['rxjs'],
  input: resolve('./src/index.ts'),
  output: [
    { file: resolve(pkg.module), format: 'es', sourcemap: true },
    { file: resolve(pkg.main), format: 'cjs', sourcemap: true },
    { file: resolve('dist/iife/rxlize.js'), name: 'rxlize', format: 'iife', sourcemap: 'inline' },
    { file: resolve('dist/iife/rxlize.min.js'), name: 'rxlize', format: 'iife', plugins: [terser()] },
  ],
  plugins: [
    commonjs(),
    nodeResolve({ extensions, moduleOnly: true }),
    babel({ exclude: ['node_modules/**'], extensions, babelHelpers: 'runtime' }),
  ],
};
