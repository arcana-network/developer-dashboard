import { useRoute } from 'vue-router'

import type { AppId } from '@/stores/apps.store'

function useAppId(): AppId {
  const route = useRoute()
  return Number(route.params.appId)
}

export { useAppId }
