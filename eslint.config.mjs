//@ts-check
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended'
import { FlatCompat } from '@eslint/eslintrc'
import { fixupConfigRules } from '@eslint/compat'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const patchedConfig = fixupConfigRules([
  ...compat.extends('next/core-web-vitals'),
])

const config = [
  ...patchedConfig,
  ...ts.configs.recommended,
  prettierConfigRecommended,
  {
    ignores: ['.next/*'],
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      'prettier/prettier': [
        'error',
        {
          printWidth: 80,
          tabWidth: 2,
          singleQuote: true,
          trailingComma: 'all',
          arrowParens: 'always',
          semi: false,
          endOfLine: 'auto',
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
]

export default config
