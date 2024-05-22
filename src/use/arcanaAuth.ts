import { AuthProvider, type EthereumProvider } from '@arcana/auth'

const ARCANA_APP_ADDRESS = import.meta.env.VITE_ARCANA_APP_ADDRESS

let authInstance: AuthProvider

function useArcanaAuth() {
  async function init() {
    if (!authInstance) {
      authInstance = new AuthProvider(ARCANA_APP_ADDRESS)
      await authInstance.init()
    }
  }

  async function isLoggedIn() {
    return await authInstance.isLoggedIn()
  }

  function getAuthInstance() {
    return authInstance
  }

  async function loginWithSocial(type: string) {
    if (!(await isLoggedIn())) {
      return await authInstance.loginWithSocial(type)
    }
  }

  async function loginWithOTP(email: string) {
    const loginState = await authInstance.loginWithOTPStart(email)
    try {
      await loginState.begin()
    } catch (e) {
      console.log(e)
    }
    return loginState.isCompleteRequired
  }

  async function verifyLoginWithOTP(otp: string) {
    await authInstance.loginWithOTPComplete(otp)
  }

  async function fetchUserDetails() {
    return authInstance.getUser()
  }

  async function logout() {
    try {
      await authInstance.logout()
    } catch (e) {
      console.log('Could not logout', e)
    }
  }

  async function getPublicKey(email: string) {
    return await authInstance.getPublicKey(email)
  }

  function getProvider() {
    return authInstance.provider as unknown as EthereumProvider
  }

  return {
    init,
    isLoggedIn,
    loginWithOTP,
    verifyLoginWithOTP,
    loginWithSocial,
    logout,
    fetchUserDetails,
    getPublicKey,
    getProvider,
    getAuthInstance,
  }
}

export default useArcanaAuth
