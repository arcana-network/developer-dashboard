import { defineStore } from 'pinia'

import {
  getChains,
  addChain,
  deleteChain,
  editChain,
  setDefaultChain,
  getAllChains,
} from '@/services/gateway.service'
import type { Network } from '@/utils/constants'

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
    defaultChainId: ({ appChains }) => {
      const defaultChain =
        appChains.find((chain) => chain.default_chain) || appChains[0]
      if (defaultChain) return defaultChain.chain_id
    },
  },
  actions: {
    async getAppChains(appId: string, network: Network) {
      const { chains } = (await getChains(appId, network)).data
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
    async getAllAppChains(network: Network) {
      const { chains } = (await getAllChains(network)).data
      this.allChains = chains
    },
    async addAppChain(appId: string, chainData: object, network: Network) {
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
      await addChain(appId, payload, network)
    },
    async deleteAppChain(appId: string, id: string, network: Network) {
      const payload = { id }
      await deleteChain(appId, payload, network)
    },
    async editAppChain(appId: string, chainData: object, network: Network) {
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
      await editChain(appId, payload, network)
    },
    async setAppDefaultChain(appId: string, id: number, network: Network) {
      const payload = { id }
      await setDefaultChain(appId, payload, network)
    },
    async toggleAppChainStatus(appId: string, data: number, network: Network) {
      const payload = { id: data.id, status: data.status }
      await editChain(appId, payload, network)
    },
  },
})

export { useChainManagementStore }
