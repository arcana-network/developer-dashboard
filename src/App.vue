<script lang="ts" setup>
import { onBeforeMount, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import VToast from '@/components/lib/VToast/VToast.vue'
import { getConfig } from '@/services/gateway.service'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useUrlStore } from '@/stores/url.store'
import useArcanaAuth from '@/use/arcanaAuth'

const appStore = useAppStore()
const loaderStore = useLoaderStore()
const urlStore = useUrlStore()
const authStore = useAuthStore()
const route = useRoute()
const arcanaAuth = useArcanaAuth()
const isLoading = computed(() => loaderStore.isLoading)
const loadingMessage = computed(() => loaderStore.message)
const isAuthLoaded = ref(false)

onBeforeMount(async () => {
  loaderStore.showLoader('Initializing Arcana Auth SDK...')
  await arcanaAuth.init()
  isAuthLoaded.value = true

  if (!urlStore.forwarder || !urlStore.rpcUrl) {
    const configResponse = await getConfig()
    const config = configResponse.data
    urlStore.updateUrls(config?.Forwarder, config?.RPC_URL)
  }

  loaderStore.showLoader('Fetching app configuration...')
  if (!appStore.appName && authStore.accessToken) {
    await appStore.fetchAppConfig()
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
