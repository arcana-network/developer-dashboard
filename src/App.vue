<script lang="ts">
import { onBeforeMount, ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import FullScreenLoader from '@/components/FullScreenLoader.vue'
import {
  fetchAndStoreAppConfig,
  getConfig,
} from '@/services/app-config.service'
import useArcanaAuth from '@/use/arcanaAuth'
import { stringToBuffer } from '@/utils/cryptoUtils'

const App = {
  components: { FullScreenLoader },
  setup() {
    const store = useStore()
    const route = useRoute()
    const arcanaAuth = useArcanaAuth()
    const loading = ref('')
    const loadingMessage = ref('')
    const isAuthLoaded = ref(false)

    onBeforeMount(async () => {
      const encodedAccessToken = localStorage.getItem('access-token')
      const userInfo = localStorage.getItem('user-info')
      if (encodedAccessToken && userInfo) {
        const accessToken = new TextDecoder().decode(
          stringToBuffer(encodedAccessToken)
        )
        store.dispatch('updateAccessToken', accessToken)
        store.dispatch('updateUserInfo', JSON.parse(userInfo))
      }

      await arcanaAuth.init()

      if (!store.getters['test/forwarder'] || !store.getters['test/rpc']) {
        const configResponse = await getConfig()
        const config = configResponse.data
        store.dispatch('test/updateForwarder', config?.Forwarder)
        store.dispatch('test/updateRPCUrl', config?.RPC_URL)
      }

      if (!store.getters.appName && store.getters.accessToken) {
        loading.value = true
        loadingMessage.value = 'Fetching app configuration...'
        await fetchAndStoreAppConfig()
        loading.value = false
      }

      isAuthLoaded.value = true
    })

    return {
      loading,
      loadingMessage,
      isAuthLoaded,
      route,
    }
  },
}

export default App
</script>

<template>
  <div>
    <router-view v-if="isAuthLoaded" v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <div :key="route.name">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
    <full-screen-loader
      v-if="loading || !isAuthLoaded"
      :message="loadingMessage"
    />
  </div>
</template>

<style>
#app {
  height: 100vh;
  overflow-x: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
