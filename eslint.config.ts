import configWebApp, { defineConfig } from 'eslint-config-cityssm'

export const config = defineConfig(
  configWebApp,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    },
    rules: {
      '@typescript-eslint/no-unsafe-type-assertion': 'off'
    }
  },
  {
    files: ['**/*.md'],
    rules: {
      'markdown/no-missing-label-refs': 'off'
    }
  }
)

export default config
