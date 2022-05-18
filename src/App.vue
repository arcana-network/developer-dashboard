<script lang="ts" setup>
import { onBeforeMount, ref, computed } from 'vue'
import { useStore } from 'vuex'

import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { getConfig } from '@/services/gateway.service'
import useArcanaAuth from '@/use/arcanaAuth'
import cryptoUtils from '@/utils/cryptoUtils'

const store = useStore()
const arcanaAuth = useArcanaAuth()
const isLoading = computed(() => store.getters.isLoading)
const loadingMessage = computed(() => store.getters.loadingMessage)
const isAuthLoaded = ref(false)

onBeforeMount(async () => {
  store.commit('showLoader', 'Initializing Arcana Auth SDK...')
  await arcanaAuth.init()
  store.commit('showLoader', 'Fetching app configuration...')
  const encodedAccessToken = localStorage.getItem('access-token')
  const userInfo = localStorage.getItem('user-info')
  if (encodedAccessToken && userInfo) {
    const accessToken = new TextDecoder().decode(
      cryptoUtils.stringToBuffer(encodedAccessToken)
    )
    store.dispatch('updateAccessToken', accessToken)
    store.dispatch('updateUserInfo', JSON.parse(userInfo))
  }
  isAuthLoaded.value = true
  if (!store.getters['forwarder'] || !store.getters['rpc']) {
    const configResponse = await getConfig()
    const config = configResponse.data
    store.commit('updateForwarder', config?.Forwarder)
    store.commit('updateRpcUrl', config?.RPC_URL)
  }

  if (!store.getters.appName && store.getters.accessToken) {
    await store.dispatch('fetchAppConfig')
  }
  store.commit('hideLoader')
})
</script>

<template>
  <div>
    <router-view v-if="isAuthLoaded" v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <FullScreenLoader
      v-if="isLoading || !isAuthLoaded"
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
