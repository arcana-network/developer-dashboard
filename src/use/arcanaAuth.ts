import { AuthProvider } from '@arcana/auth'

import { useAppsStore } from '@/stores/apps.store'
import { useAuthStore } from '@/stores/auth.store'

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK

let authInstance: AuthProvider

function useArcanaAuth() {
  const authStore = useAuthStore()
  const appsStore = useAppsStore()

  async function init() {
    if (!authInstance) {
      authInstance = new AuthProvider(ARCANA_APP_ID, {
        network: ARCANA_AUTH_NETWORK,
        debug: true,
      })
      await authInstance.init()
    }
  }

  async function isLoggedIn() {
    return await authInstance.isLoggedIn()
  }

  async function loginWithSocial(type: string) {
    if (!(await isLoggedIn())) {
      return await authInstance.loginWithSocial(type)
    }
  }

  async function loginWithLink(email: string) {
    if (!(await isLoggedIn())) {
      await authInstance.loginWithLink(email)
    }
  }

  async function fetchUserDetails() {
    return authInstance.getUser()
  }

  async function logout() {
    await authInstance.logout()
    appsStore.$reset()
    authStore.$reset()
  }

  async function getPublicKey(email: string) {
    return await authInstance.getPublicKey(email)
  }

  return {
    init,
    isLoggedIn,
    loginWithSocial,
    loginWithLink,
    logout,
    fetchUserDetails,
    getPublicKey,
  }
}

export default useArcanaAuth
