import uglify from 'rollup-plugin-uglify'
import builtins from 'rollup-plugin-node-builtins'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babelrc from 'babelrc-rollup'
import babel from 'rollup-plugin-babel'
import globals from 'rollup-plugin-node-globals'

export default {
  input: './web/bundle-entrypoint',
  output: {
    file: './web/dist/bundle.js',
    format: 'iife',
    name: 'zmd',
  },
  plugins: [
    resolve({
      jsnext: true,
      browser: true,
      main: true,
    }),
    commonjs(),
    builtins(),
    json({
      preferConst: true,
    }),
    babel(babelrc({
      config: {
        exclude: 'node_modules/**',
        presets: [
          ['env', {modules: false, targets: {browsers: ['ie 6']}}],
        ],
        plugins: ['external-helpers'],
      },
    })),
    globals(),
    // uglify(),
  ],
}
