// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineNuxtConfig } from 'nuxt/config'

// /////////////////////////////////////////////////////////// Variables & Setup
// -----------------------------------------------------------------------------
const env = process.env.SERVER_ENV

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
            @import "@/assets/scss/settings.scss";
          `
        }
      }
    },
    assetsInclude: ['**/*.md']
  },
  // ==================================================================== Server
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: [ // adds route to prerender
        '/prerender-ssg-sitemap',
        '/generate-algolia-index',
        '/sitemap.xml',
        '/ipfs-404'
      ]
    }
  },
  // ================================================================== Compiler
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },
  // ============================================================= Global Styles
  css: [
    '@/../zero-core/assets/scss/main.scss'
  ],
  // ================================================================ Components
  /**
   * @note Empty array because components are selectively auto-loaded by the
   * `zero-core` module
   */
  components: { dirs: [] },
  // ============================================================ [Module] Pinia
  pinia: {
    storesDirs: [
      '../zero-core/stores/**'
    ]
  },
  // =================================================================== Modules
  modules: [
    '@nuxtjs/algolia',
    'nuxt-simple-robots', // https://github.com/harlan-zw/nuxt-simple-robots
    'nuxt-simple-sitemap', // https://github.com/harlan-zw/nuxt-simple-sitemap
    'nuxt-primevue' // https://github.com/primefaces/primevue-nuxt-module
  ],
  // ========================================================== [Module] sitemap
  sitemap: {
    sources: [
      '/api/generate-sitemap'
    ]
  },
  // ========================================================= [Module] Primevue
  primevue: {
    disable: true,
    components: {
      prefix: 'PrimeVue',
      include: ['FileUpload']
    }
  }
})
