<script lang="ts" setup>
import { onBeforeMount, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import AppFooter from '@/components/AppFooter.vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import VToast from '@/components/lib/VToast/VToast.vue'
import { getConfig } from '@/services/gateway.service'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'

const store = useStore()
const loaderStore = useLoaderStore()
const route = useRoute()
const arcanaAuth = useArcanaAuth()
const isLoading = computed(() => store.getters.isLoading)
const loadingMessage = computed(() => store.getters.loadingMessage)
const isAuthLoaded = ref(false)

onBeforeMount(async () => {
  loaderStore.showLoader('Initializing Arcana Auth SDK...')
  await arcanaAuth.init()
  isAuthLoaded.value = true

  if (!store.getters['forwarder'] || !store.getters['rpc']) {
    const configResponse = await getConfig()
    const config = configResponse.data
    store.commit('updateForwarder', config?.Forwarder)
    store.commit('updateRpcUrl', config?.RPC_URL)
  }

  loaderStore.showLoader('Fetching app configuration...')
  if (!store.getters.appName && store.getters.accessToken) {
    await store.dispatch('fetchAppConfig')
  }
  loaderStore.hideLoader()
})
</script>

<template>
  <div class="root">
    <router-view v-if="isAuthLoaded" v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <AppFooter v-if="isAuthLoaded && !route.path.includes('/configure/')" />
    <FullScreenLoader
      v-if="isLoading || !isAuthLoaded"
      :message="loadingMessage"
    />
    <VToast />
  </div>
</template>

<style>
#app {
  height: 100vh;
  overflow-x: hidden;
}

.root {
  height: 100vh;
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
