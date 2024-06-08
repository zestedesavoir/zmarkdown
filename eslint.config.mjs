import globals from 'globals'

import path from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import pluginJs from '@eslint/js'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended })

export default [
  Object.assign({}, ...compat.extends('standard'), {
    files: ['packages/**/*.js'],
    ignores: [
      'packages/**/__tests__/*.js',
      'packages/**/dist/**/*.js',
      'packages/zmarkdown/webpack.config.js',
      // Handled by ESM rules
      'packages/zmarkdown/client/*.js',
      'packages/zmarkdown/public/*.js',
      'packages/**/lib/*.js'
    ],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  }),
  Object.assign({}, ...compat.extends('standard'), {
    files: [
      'packages/**/lib/*.js'
    ],
    ignores: [],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  })
]
