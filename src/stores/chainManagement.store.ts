import { defineStore } from 'pinia'

import {
  getChains,
  addChain,
  deleteChain,
  editChain,
  setDefaultChain,
  getAllChains,
} from '@/services/gateway.service'

const useChainManagementStore = defineStore('chain-management', {
  state: () => ({
    appChains: [],
    allChains: [],
    chainSearchText: '',
  }),
  getters: {
    areChainsEmpty: ({ appChains }) => {
      return appChains.length === 0
    },
    filteredChains: ({ appChains, chainSearchText }) => {
      return appChains.filter((chain) =>
        chain.name.toLowerCase().includes(chainSearchText.toLowerCase())
      )
    },
  },
  actions: {
    async getAppChains(appId: string) {
      const { chains } = (await getChains(appId)).data
      if (!chains) this.appChains = []
      else {
        let defaultChainIdx = chains.findIndex((chain) => !!chain.default_chain)
        defaultChainIdx = defaultChainIdx >= 0 ? defaultChainIdx : 0
        const defaultChain = chains[defaultChainIdx]
        chains.splice(defaultChainIdx, 1)
        chains.unshift(defaultChain)
        this.appChains = chains
      }
    },
    async getAllAppChains() {
      const { chains } = (await getAllChains()).data
      this.allChains = chains
    },
    async addAppChain(appId: string, chainData: object) {
      const payload = {
        name: chainData.name,
        chain_id: Number(chainData.chainId),
        chain_type: chainData.chainType,
        compatibility: 'EVM',
        currency: chainData.currency,
        rpc_url: chainData.rpcURL,
        exp_url: chainData.explorerURL,
        status: true,
      }
      await addChain(appId, payload)
    },
    async deleteAppChain(appId: string, id: string) {
      const payload = { id }
      await deleteChain(appId, payload)
    },
    async editAppChain(appId: string, chainData: object) {
      const payload = {
        name: chainData.name,
        chain_id: Number(chainData.chainId),
        chain_type: chainData.chainType,
        compatibility: 'EVM',
        currency: chainData.currency,
        rpc_url: chainData.rpcURL,
        exp_url: chainData.explorerURL,
        status: chainData.status,
        id: chainData.id,
      }
      await editChain(appId, payload)
    },
    async setAppDefaultChain(appId: string, id: number) {
      const payload = { id }
      await setDefaultChain(appId, payload)
    },
    async toggleAppChainStatus(appId: string, data: number) {
      const payload = { id: data.id, status: data.status }
      await editChain(appId, payload)
    },
  },
})

export { useChainManagementStore }
