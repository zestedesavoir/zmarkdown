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
      // Should not be ignored, but requires ESM
      'packages/zmarkdown/client/*.js',
      'packages/zmarkdown/public/*.js'
    ],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  })
]
