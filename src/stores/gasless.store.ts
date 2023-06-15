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
}

const useGaslessStore = defineStore('gasless', {
  state: (): GaslessState => ({
    gastankList: [],
  }),
  getters: {
    areGastankListEmpty: ({ gastankList }) => {
      return gastankList.length === 0
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
