import { defineStore } from 'pinia'

const TOAST_TIMEOUT = 5600

type ToastMessageType = 'success' | 'error'

type ToastMessage = {
  type: ToastMessageType
  message: string
  id: number
}

interface ToastState {
  messages: ToastMessage[]
}

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    messages: [],
  }),
  actions: {
    showSuccessToast(message: string) {
      const successToastMessage = {
        type: 'success' as ToastMessageType,
        id: Date.now(),
        message,
      }
      this.showToast(successToastMessage)
    },
    showErrorToast(message: string) {
      const errorToastMessage = {
        type: 'error' as ToastMessageType,
        id: Date.now(),
        message,
      }
      this.showToast(errorToastMessage)
    },
    showToast(toast: ToastMessage) {
      this.messages.unshift(toast)
      setTimeout(() => this.removeToast(toast), TOAST_TIMEOUT)
    },
    removeToast(toast: ToastMessage) {
      this.messages = this.messages.filter((msg) => msg.id !== toast.id)
    },
  },
})

export type { ToastMessage }
