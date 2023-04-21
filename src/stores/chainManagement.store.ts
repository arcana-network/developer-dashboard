import { defineStore } from 'pinia'

import { getChains } from '@/services/gateway.service'

const useChainManagementStore = defineStore('chain-management', {
  state: () => ({
    chains: [],
  }),
  getters: {
    areChainsEmpty: ({ chains }) => {
      return chains.length === 0
    },
  },
  actions: {
    async getAppChains(appId: string) {
      const { chains } = (await getChains(appId)).data
      this.chains = chains || []
    },
  },
})

export { useChainManagementStore }
