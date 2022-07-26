import { useStore } from 'vuex'

function useToast() {
  const store = useStore()

  function success(message: string) {
    store.dispatch('showSuccessToast', message)
  }

  function error(message: string) {
    store.dispatch('showErrorToast', message)
  }

  return {
    success,
    error,
  }
}

export { useToast }
