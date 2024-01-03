import { defineStore } from 'pinia'

import {
  getChains,
  addChain,
  deleteChain,
  editChain,
  setDefaultChain,
  getAllChains,
  getGaslessSupportChains,
} from '@/services/gateway.service'
import type { Network } from '@/utils/constants'

const useChainManagementStore = defineStore('chain-management', {
  state: () => ({
    appChains: [] as any[],
    allChains: [] as any[],
    gaslessChains: {} as any,
    chainSearchText: '',
    selectedChainType: 'evm',
  }),
  getters: {
    areChainsEmpty: ({ appChains }) => {
      return appChains.length === 0
    },
    filteredChains: ({ appChains, chainSearchText, selectedChainType }) => {
      return appChains.filter(
        (chain) =>
          chain.compatibility?.toLowerCase() ===
            selectedChainType.toLowerCase() &&
          chain.name.toLowerCase().includes(chainSearchText.toLowerCase())
      )
    },
    chainTypeSpecificChains:
      ({ allChains }) =>
      (chainType: string) => {
        return allChains.filter(
          (chain) =>
            chain.compatibility?.toLowerCase() === chainType?.toLowerCase()
        )
      },
    defaultChainId: ({ appChains }) => {
      const defaultChain =
        appChains.find((chain) => chain.default_chain) || appChains[0]
      if (defaultChain) return defaultChain.chain_id
    },
  },
  actions: {
    setChainType(appId: number, network: Network, chainType: string) {
      this.selectedChainType = chainType
      this.getAppChains(appId, network)
    },
    async getAppChains(appId: number, network: Network) {
      const { chains } = (await getChains(appId, network)).data as {
        chains: any[]
      }
      if (!chains) this.appChains = []
      else {
        let defaultChainIdx = chains.findIndex((chain) => !!chain.default_chain)
        defaultChainIdx = defaultChainIdx >= 0 ? defaultChainIdx : 0
        const defaultChain = chains[defaultChainIdx]
        chains.splice(defaultChainIdx, 1)
        chains.unshift(defaultChain)
        this.appChains = chains.map((chain) => ({
          ...chain,
          id: chain.chain_id,
        }))
      }
    },
    async getAllAppChains(network: Network) {
      const { chains } = (await getAllChains(network)).data
      this.allChains = chains
    },
    async getGaslessChains(network: Network) {
      const chains = (await getGaslessSupportChains(network)).data
      this.gaslessChains = chains
    },
    async addAppChain(appId: number, chainData: any, network: Network) {
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
    async deleteAppChain(appId: number, id: number, network: Network) {
      const payload = { id: id }
      await deleteChain(appId, payload, network)
    },
    async editAppChain(appId: number, chainData: any, network: Network) {
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
    async setAppDefaultChain(appId: number, id: number, network: Network) {
      const payload = { id: id }
      await setDefaultChain(appId, payload, network)
    },
    async toggleAppChainStatus(appId: number, data: any, network: Network) {
      const payload = { id: data.id, status: data.status }
      await editChain(appId, payload, network)
    },
  },
})

export { useChainManagementStore }
