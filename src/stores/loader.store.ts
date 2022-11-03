import { defineStore } from 'pinia'

interface LoaderState {
  isLoading: boolean
  message: string
}

export const useLoaderStore = defineStore('loader', {
  state: (): LoaderState => ({
    isLoading: false,
    message: '',
  }),
  actions: {
    showLoader(message: string) {
      this.isLoading = true
      this.message = message
    },
    hideLoader() {
      this.isLoading = false
      this.message = ''
    },
  },
})
