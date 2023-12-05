console.log('⚡️ load:zero-core')

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineNuxtConfig } from 'nuxt/config'

// /////////////////////////////////////////////////////////// Variables & Setup
// -----------------------------------------------------------------------------
const env = process.env.SERVER_ENV

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtConfig({
  // ===================================================== Runtime Configuration
  runtimeConfig: {
    public: {
      // githubOAuthLink: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_OAUTH_CLIENT_ID}&scope=user:email,public_repo`
    }
  },
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
  sitemap: {},
  // ========================================================= [Module] Primevue
  primevue: {
    disable: true,
    components: {
      prefix: 'PrimeVue',
      include: ['FileUpload']
    }
  }
})
