import { useAppsStore } from '@/stores/apps.store'
import { useAuthStore } from '@/stores/auth.store'

const { AuthProvider, CHAIN } = window.arcana.auth

const ARCANA_APP_ADDRESS = import.meta.env.VITE_ARCANA_APP_ADDRESS
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK

let authInstance: AuthProvider
let network: 'testnet' | 'mainnet' | any

if (ARCANA_AUTH_NETWORK === 'mainnet') {
  network = {
    authUrl: 'https://auth.arcana.network',
    gatewayUrl: 'https://gateway.arcana.network',
    walletUrl: 'https://wallet.arcana.network',
  }
} else {
  network = ARCANA_AUTH_NETWORK
}

function useArcanaAuth() {
  const authStore = useAuthStore()
  const appsStore = useAppsStore()

  async function init() {
    if (!authInstance) {
      authInstance = new AuthProvider(ARCANA_APP_ADDRESS, {
        network,
        debug: true,
        chainConfig: {
          chainId: CHAIN.POLYGON_MAINNET,
          rpcUrl: 'https://polygon-rpc.com/',
        },
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
