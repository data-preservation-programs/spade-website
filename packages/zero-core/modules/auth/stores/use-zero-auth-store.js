// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { defineStore } from 'pinia'
import { useFetchAuth } from '../composables/use-fetch-auth'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useZeroAuthStore = defineStore('zero-auth', () => {
  // ===================================================================== state
  const session = ref(null)
  const user = ref(null)

  // ================================================================== computed
  const loggedIn = computed(() => session.value !== null)
  const ethereum = computed(() => process.client ? window.ethereum : undefined)
  const metamaskInstalled = computed(() => ethereum.value && ethereum.value.isMetaMask)

  // =================================================================== actions
  /**
   * @method setSession
   */

  const setSession = (payload) => {
    session.value = payload
  }

  /**
   * @method getUser
   */

  const getUser = async (userId) => {
    try {
      const response = await useFetchAuth('/get-user', {
        method: 'get',
        query: { userId }
      })
      setUser(response)
      return response
    } catch (e) {
      setUser(null)
      return null
    }
  }

  /**
   * @method setUser
   */

  const setUser = (payload) => {
    user.value = payload
  }

  // ==================================================================== return
  return {
    // ----- state
    session,
    user,
    // ----- computed
    loggedIn,
    ethereum,
    metamaskInstalled,
    // ----- actions
    setSession,
    getUser,
    setUser
  }
})
