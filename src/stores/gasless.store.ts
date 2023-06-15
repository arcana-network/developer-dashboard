import { defineStore } from 'pinia'

import { getGastanks } from '@/services/gateway.service'
import type { Network } from '@/utils/constants'

type GasTank = {
  app_id: number
  chainId: number | string
  deposit_address: string
  id: number
  name: string
  network: string
  type: string
  whitelists: number
}

type GaslessState = {
  gastankList: Array<GasTank>
  chainSearchText: string
}

const useGaslessStore = defineStore('gasless', {
  state: (): GaslessState => ({
    gastankList: [],
    chainSearchText: '',
  }),
  getters: {
    areGastankListEmpty: ({ gastankList }) => {
      return gastankList.length === 0
    },
    filteredGastankList: ({ gastankList, chainSearchText }) => {
      return gastankList.filter((item) =>
        item.name.toLowerCase().includes(chainSearchText.toLowerCase())
      )
    },
  },
  actions: {
    async getGastankList(appId: number, network: Network) {
      const gastanks = (await getGastanks(appId, network)).data
      this.gastankList = gastanks
    },
  },
})

export { useGaslessStore }
