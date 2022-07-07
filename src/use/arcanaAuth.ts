import { AuthProvider, SocialLoginType } from '@arcana/auth-core'
import { useStore } from 'vuex'

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK

let authInstance: AuthProvider

function useArcanaAuth() {
  const store = useStore()

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

  function handleRedirect() {
    AuthProvider.handleRedirectPage(window.location)
  }

  async function logout() {
    await authInstance.logout()
    store.dispatch('resetStore')
  }

  async function getPublicKey(email) {
    return await authInstance.getPublicKey({
      verifier: SocialLoginType.google,
      id: email,
    })
  }

  return {
    init,
    handleRedirect,
    isLoggedIn,
    loginWithSocial,
    logout,
    fetchUserDetails,
    getPublicKey,
  }
}

export default useArcanaAuth
