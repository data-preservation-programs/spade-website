// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineStore } from 'pinia'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useZeroAlgoliaStore = defineStore('zero-algolia', () => {
  // ===================================================================== state
  const modalActive = ref(false)
  const activeResult = ref(false)

  // =================================================================== actions

  /**
   * @method toggleModal
   */

  const toggleModal = (state) => {
    document.body.classList[state ? 'add' : 'remove']('no-scroll')
    modalActive.value = state
  }

  /**
   * @method setActiveResult
   */

  const setActiveResult = (hitObjectID) => {
    activeResult.value = hitObjectID
  }

  // ==================================================================== return
  return {
    // ----- state
    modalActive,
    activeResult,
    // ----- actions
    toggleModal,
    setActiveResult
  }
})
