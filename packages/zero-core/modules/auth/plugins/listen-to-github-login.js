// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineNuxtPlugin } from '#imports'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// ///////////////////////////////////////////////////////// listenToGithubLogin
const listenToGithubLogin = siteUrl => {
  if (process.client) {
    window.addEventListener('message', async (e) => {
      const data = e.data
      if ((e.origin !== siteUrl) || !data || e.source.name !== 'login-github-popup') { return }
      if (typeof data === 'object' && data.hasOwnProperty('session')) {
        useSetSession(data)
      }
    }, false)
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  listenToGithubLogin(config.public.siteUrl)
})
