/**
 * 1. Check for and/or create new user
 * 2. Send user metamask nonce back to frontend
 * 3. Frontend signs the nonce via web3.eth.personal.sign() and sends back to backend
 * 4. Backend verifies signature + sends back session
 */

// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import Web3 from 'web3'

import { useZeroAuthStore } from '../stores/use-zero-auth-store'

// /////////////////////////////////////////////////////////////////// Functions
// -----------------------------------------------------------------------------
// //////////////////////////////////////////////////////////////////////// sign
const sign = async (ethAddress, nonce) => {
  const web3 = new Web3(window.ethereum)
  return await web3.eth.personal.sign(
    web3.utils.fromUtf8(`Nonce: ${nonce}`),
    ethAddress,
    ''
  )
}

// //////////////////////////////////////////////////////////////// authenticate
const authenticate = async (authStore) => {
  try {
    const accounts = await authStore.ethereum.request({ method: 'eth_requestAccounts' })
    const response = await useFetchAuth('/login', {
      method: 'post',
      query: { strategy: 'metamask', action: 'initialize' },
      body: accounts
    })
    const nonce = response.nonce
    const signature = await sign(response.ethAddress, nonce)
    const session = await useFetchAuth('/login', {
      method: 'post',
      query: { strategy: 'metamask', action: 'authenticate' },
      body: { signature, nonce, userId: response.userId }
    })
    useSetSession({
      session,
      loader: 'auth-metamask'
    })
  } catch (e) {
    console.log('☠️ useAuthenticateMetamask')
    console.log(e)
  }
}

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useAuthenticateMetamask = () => {
  const authStore = useZeroAuthStore()
  authStore.metamaskInstalled ?
    authenticate(authStore) :
    navigateTo('https://metamask.io/', {
      external: true,
      open: {
        target: '_blank'
      }
    })
}
