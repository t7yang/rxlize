const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const externalBundle = require('rollup-plugin-exclude-dependencies-from-bundle');
const { terser } = require('rollup-plugin-terser');
const path = require('path');
const pkg = require('./package.json');

const resolve = (...args) => path.resolve(__dirname, ...args);

const extensions = ['.ts', '.js'];
const browserShared = {
  format: 'umd',
  name: 'rxlize',
  globals: { rxjs: 'rxjs', ['rxjs/operators']: 'rxjs.operators' },
};

module.exports = [
  {
    input: resolve('./src/index.ts'),
    output: [
      { file: resolve(pkg.module), format: 'es', sourcemap: true },
      { file: resolve(pkg.main), format: 'cjs', sourcemap: true },
    ],
    plugins: [
      commonjs(),
      nodeResolve({ extensions, moduleOnly: true }),
      babel({ exclude: ['node_modules/**'], extensions, babelHelpers: 'runtime' }),
      externalBundle(),
    ],
  },
  {
    external: ['rxjs', 'rxjs/operators'],
    input: resolve('./src/index.ts'),
    output: [
      { file: resolve(pkg.browser), ...browserShared, sourcemap: 'inline' },
      { file: resolve(pkg.browser.replace('.js', '.min.js')), ...browserShared, plugins: [terser()] },
    ],
    plugins: [
      commonjs(),
      nodeResolve({ extensions, moduleOnly: true }),
      babel({ exclude: ['node_modules/**'], extensions: ['.ts'], babelHelpers: 'runtime' }),
    ],
  },
];
