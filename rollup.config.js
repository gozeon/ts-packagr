import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import uglify from 'rollup-plugin-uglify';
import camelCase from 'lodash.camelcase';

const pkg = require('./package.json');
const libraryName = pkg.name;

const baseConfig = {
  input: 'src/index.ts',
  sourcemap: true,
  watch: {
    include: 'src/**'
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript(),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps()
  ],
  sourcemap: true
};

const es6Config = Object.assign({}, baseConfig, {
  output: {
    file: pkg.es2015,
    format: 'es'
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          target: 'es6',
          declaration: true
        }
      }
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps()
  ]
});

const esConfig = Object.assign({}, baseConfig, {
  output: {
    file: pkg.module,
    format: 'es'
  }
});

const umdConfig = Object.assign({}, baseConfig, {
  output: {
    file: pkg.main,
    name: camelCase(libraryName),
    format: 'umd'
  }
});

const iifeConfig = Object.assign({}, baseConfig, {
  input: 'src/iife.ts',
  output: {
    file: pkg.browser,
    name: camelCase(libraryName),
    format: 'iife',
    sourcemap: false
  },
  plugins: [json(), typescript(), commonjs(), resolve(), uglify()]
});

export default [es6Config, esConfig, umdConfig, iifeConfig];
