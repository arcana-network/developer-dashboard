import { defineStore } from 'pinia'

import {
  getChains,
  addChain,
  deleteChain,
  editChain,
  setDefaultChain,
} from '@/services/gateway.service'

const useChainManagementStore = defineStore('chain-management', {
  state: () => ({
    chains: [],
    chainSearchText: '',
  }),
  getters: {
    areChainsEmpty: ({ chains }) => {
      return chains.length === 0
    },
    filteredChains: ({ chains, chainSearchText }) => {
      return chains.filter((chain) => chain.name.includes(chainSearchText))
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
        chain_id: Number(chainData.chainId),
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
    async deleteAppChain(appId: string, id: string) {
      const data = { id }
      const response = (await deleteChain(appId, data)).data
      console.log(response)
    },
    async editAppChain(appId: string, chainData: object) {
      const data = {
        name: chainData.name,
        chain_id: Number(chainData.chainId),
        chain_type: chainData.chainType,
        compatibility: 'EVM',
        currency: chainData.currency,
        rpc_url: chainData.rpcURL,
        exp_url: chainData.explorerURL,
        status: true,
        id: chainData.id,
      }
      const response = (await editChain(appId, data)).data
      console.log(response)
    },
    async setAppDefaultChain(appId: string, id: number) {
      const data = { id }
      const response = (await setDefaultChain(appId, data)).data
      console.log(response)
    },
  },
})

export { useChainManagementStore }
