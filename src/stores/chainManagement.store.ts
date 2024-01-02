import { defineStore } from 'pinia'

import {
  getChains,
  addChain,
  deleteChain,
  editChain,
  setDefaultChain,
  getAllChains,
  getGaslessSupportChains,
  fetchApp,
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
    async getAppChains(appId: number, network: Network) {
      const app = (await fetchApp(appId, network)).data
      this.selectedChainType = app.chain_type?.toLowerCase() || 'evm'
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
      const [evm, solana] = await getAllChains(network)
      this.allChains = [...evm.data.chains, ...solana.data.chains]
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
      const payload = { chain_id: id }
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
      const payload = { chain_id: id }
      await setDefaultChain(appId, payload, network)
    },
    async toggleAppChainStatus(appId: number, data: any, network: Network) {
      console.log(data)
      const payload = { chain_id: data.id, status: data.status }
      await editChain(appId, payload, network)
    },
  },
})

export { useChainManagementStore }
