// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineNuxtConfig } from 'nuxt/config'
import Path from 'path'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtConfig({
  // ================================================================== Compiler
  vite: {
    css: {
      preprocessorOptions: {
        scss: { // make SCSS variables, functions and mixins globally accessible
          additionalData: `
            @use "sass:math";
            @import "@/../zero-core/assets/scss/settings.scss";
            @import "@/../zero-docs/assets/scss/settings.scss";
            @import "@/assets/scss/settings.scss";
          `
        }
      }
    },
    assetsInclude: ['**/*.md']
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false
    }
  },
  // ============================================================= Global Styles
  css: [
    '@/../zero-docs/assets/scss/main.scss'
  ],
  // ================================================================ Components
  /**
   * @note Auto-load components found inside content directories
   */
  components: [
    {
      path: '@/../zero-docs/components'
    },
    {
      path: '@/../zero-docs/content/',
      prefix: 'Preview',
      global: true
    }
  ],
  // ============================================================ [Module] Pinia
  pinia: {
    storesDirs: [
      '../zero-docs/stores/**'
    ]
  },
  // ========================================================== [Module] Content
  content: {
    sources: {
      targetDocs: {
        driver: 'fs',
        prefix: '/docs',
        base: Path.resolve(__dirname, '../docs', 'content')
      },
      srcDocs: {
        driver: 'fs',
        prefix: '/docs',
        base: Path.resolve(__dirname, 'content')
      },
      targetData: {
        driver: 'fs',
        prefix: '/data',
        base: Path.resolve(__dirname, '../docs', 'data')
      },
      srcData: {
        driver: 'fs',
        prefix: '/data',
        base: Path.resolve(__dirname, 'data')
      }
    }
  }
})
