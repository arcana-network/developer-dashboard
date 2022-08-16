import { useToastStore } from '@/stores/toast.store'

function useToast() {
  const toastStore = useToastStore()

  function success(message: string) {
    toastStore.showSuccessToast(message)
  }

  function error(message: string) {
    toastStore.showErrorToast(message)
  }

  return {
    success,
    error,
  }
}

export { useToast }
