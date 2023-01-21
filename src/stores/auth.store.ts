import { defineStore } from 'pinia'

import type { Network } from '@/utils/constants'

interface AuthState {
  email: string
  accessToken: {
    mainnet: string
    testnet: string
  }
  name: string
  walletAddress: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    email: '',
    accessToken: {
      mainnet: '',
      testnet: '',
    },
    name: '',
    walletAddress: '',
  }),
  actions: {
    updateAccessToken(accessToken: string, network: Network) {
      this.accessToken[network] = accessToken
    },
    updateWalletAddress(walletAddress: string) {
      this.walletAddress = walletAddress
    },
    updateUserInfo(name: string, email: string) {
      this.name = name
      this.email = email
    },
  },
})
