import { defineStore } from 'pinia'

type WalletAddress = string

type WalletProvider = object

type WalletProviderName = 'meta-mask' | 'wallet-connect'

type WalletState = {
  address: WalletAddress
  provider: WalletProvider
  providerName: WalletProviderName
}

const useWalletStore = defineStore('wallet', {
  state: () =>
    ({
      provider: {},
    } as WalletState),

  getters: {
    isConnected: (state) => state.address.length > 0,
  },
  actions: {
    setWalletProvider(provider: WalletProvider) {
      this.provider = provider
    },
    clear() {
      this.$reset()
    },
  },
})

export { useWalletStore }
