import { defineStore } from 'pinia'

interface AuthState {
  email: string
  accessToken: string
  name: string
  walletAddress: string
  privateKey: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    email: '',
    accessToken: '',
    name: '',
    walletAddress: '',
    privateKey: '',
  }),
  actions: {
    updateAccessToken(access_token: string) {
      this.accessToken = access_token
    },
    updateWalletAddress(walletAddress: string) {
      this.walletAddress = walletAddress
    },
    updateUserInfo(name: string, email: string) {
      this.name = name
      this.email = email
    },
    updateKeys(privateKey: string) {
      this.privateKey = privateKey
    },
  },
})
