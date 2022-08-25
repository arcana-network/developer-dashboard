import { useRoute } from 'vue-router'

function useAppId() {
  const route = useRoute()
  return Number(route.params.appId)
}

export { useAppId }
