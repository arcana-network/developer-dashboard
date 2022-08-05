import { AuthProvider } from '@arcana/auth'
import { useStore } from 'vuex'

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK

let authInstance: AuthProvider

function useArcanaAuth() {
  const store = useStore()

  async function init() {
    if (!authInstance) {
      authInstance = new AuthProvider(ARCANA_APP_ID, {
        network: ARCANA_AUTH_NETWORK,
        inpageProvider: true,
        debug: true,
      })
      await authInstance.init()
    }
  }

  async function isLoggedIn() {
    return await authInstance.isLoggedIn()
  }

  async function loginWithSocial(type: string) {
    if (!isLoggedIn()) {
      await authInstance.loginWithSocial(type)
    }
  }

  async function fetchUserDetails() {
    return authInstance.getUser()
  }

  async function logout() {
    await authInstance.logout()
    store.dispatch('resetStore')
  }

  async function getPublicKey(email: string) {
    return await authInstance.getPublicKey(email)
  }

  return {
    init,
    isLoggedIn,
    loginWithSocial,
    logout,
    fetchUserDetails,
    getPublicKey,
  }
}

export default useArcanaAuth
