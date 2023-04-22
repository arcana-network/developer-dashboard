import { defineStore } from 'pinia'

import { getChains, addChain } from '@/services/gateway.service'

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
    async addAppChain(appId: string, chainData: object) {
      const data = {
        name: chainData.name,
        chain_id: chainData.chainId,
        chain_type: chainData.chainType,
        compatibility: 'EVM',
        currency: chainData.currency,
        rpc_url: chainData.rpcURL,
        exp_url: chainData.explorerURL,
        status: true,
      }
      const response = (await addChain(appId, data)).data
      console.log(response)
    },
  },
})

export { useChainManagementStore }
