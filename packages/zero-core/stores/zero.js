// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { ref } from '#imports'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useZeroStore = defineStore('zero', () => {
  // ===================================================================== state
  const clipboard = ref(false)
  const seo = ref({})

  // =================================================================== actions

  /**
   * @method setClipboard
   */

  const setClipboard = text => {
    clipboard.value = text
  }

  /**
   * @method setSeo
   */

  const setSeo = content => {
    seo.value = content
  }

  // ==================================================================== return
  return {
    // ----- state
    clipboard,
    seo,
    // ----- actions
    setClipboard,
    setSeo
  }
})
