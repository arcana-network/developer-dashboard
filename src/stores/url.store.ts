import { defineStore } from 'pinia'

interface UrlState {
  forwarder: string
  rpcUrl: string
}

export const useUrlStore = defineStore('url', {
  state: (): UrlState => ({
    forwarder: '',
    rpcUrl: '',
  }),
  actions: {
    updateUrls(forwarder: string, rpcUrl: string) {
      this.forwarder = forwarder
      this.rpcUrl = rpcUrl
    },
  },
})
