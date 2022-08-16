import { defineStore } from 'pinia'

interface AuthState {
  email: string
  accessToken: string
  name: string
  walletAddress: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    email: '',
    accessToken: '',
    name: '',
    walletAddress: '',
  }),
  actions: {
    updateAccessToken(accessToken: string) {
      this.accessToken = accessToken
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
