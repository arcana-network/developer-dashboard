import { AuthProvider, SocialLoginType } from '@arcana/auth-core'

import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK

let authInstance: AuthProvider

function useArcanaAuth() {
  const authStore = useAuthStore()
  const appStore = useAppStore()

  async function init() {
    if (!authInstance) {
      authInstance = await AuthProvider.init({
        appId: ARCANA_APP_ID,
        network: ARCANA_AUTH_NETWORK,
        flow: 'redirect',
        redirectUri: `${window.location.origin}/login`,
        autoRedirect: true,
        debug: true,
      })
    }
  }

  function isLoggedIn() {
    return authInstance.isLoggedIn()
  }

  async function loginWithSocial(type = SocialLoginType.google) {
    if (!isLoggedIn()) {
      await authInstance.loginWithSocial(type)
    }
  }

  async function fetchUserDetails() {
    return authInstance.getUserInfo()
  }

  async function logout() {
    await authInstance.logout()
    appStore.$reset()
    authStore.$reset()
  }

  async function getPublicKey(email: string) {
    return await authInstance.getPublicKey({
      verifier: SocialLoginType.google,
      id: email,
    })
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
