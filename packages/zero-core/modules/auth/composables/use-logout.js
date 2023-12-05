// ///////////////////////////////////////////////////////////////////// Imports
// -----------------------------------------------------------------------------
import { useZeroAuthStore } from '../stores/use-zero-auth-store'
import { useZeroButtonStore } from '../../button/stores/use-zero-button-store'

// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useLogout = async () => {
  const { public: { auth: authConfig } } = useRuntimeConfig()
  const redirectAfterLogout = authConfig.redirectAfterLogout === '' ? null : authConfig.redirectAfterLogout
  const authStore = useZeroAuthStore()
  const buttonStore = useZeroButtonStore()
  await useFetchAuth('/logout', { method: 'post' })
  authStore.setSession(null)
  authStore.setUser(null)
  buttonStore.setButton({ id: 'auth-logout', loading: false })
  if (redirectAfterLogout) {
    console.log(redirectAfterLogout)
    navigateTo(redirectAfterLogout)
  }
}
