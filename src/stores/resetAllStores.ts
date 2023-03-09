import { useAppsStore } from '@/stores/apps.store'
import { useAuthStore } from '@/stores/auth.store'
import store from '@/stores/index'

export function resetAllStores() {
  const appsStore = useAppsStore(store)
  appsStore.$reset()

  const authStore = useAuthStore(store)
  authStore.$reset()
}
