<script lang="ts" setup>
import { onBeforeMount, ref, computed } from 'vue'
import { useStore } from 'vuex'

import FullScreenLoader from '@/components/FullScreenLoader.vue'
import appConfigService from '@/services/app-config.service'
import useArcanaAuth from '@/use/arcanaAuth'
import cryptoUtils from '@/utils/cryptoUtils'

const store = useStore()
const arcanaAuth = useArcanaAuth()
const showLoader = computed(() => store.getters.showLoader)
const loadingMessage = computed(() => store.getters.loadingMessage)
const isAuthLoaded = ref(false)

onBeforeMount(async () => {
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

  await arcanaAuth.init()
  isAuthLoaded.value = true
  if (!store.getters['test/forwarder'] || !store.getters['test/rpc']) {
    const configResponse = await appConfigService.getConfig()
    const config = configResponse.data
    store.dispatch('test/updateForwarder', config?.Forwarder)
    store.dispatch('test/updateRPCUrl', config?.RPC_URL)
  }

  if (!store.getters.appName && store.getters.accessToken) {
    await appConfigService.fetchAndStoreAppConfig()
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
      v-if="showLoader || !isAuthLoaded"
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
