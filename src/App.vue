<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import VToast from '@/components/lib/VToast/VToast.vue'
import { fetchAndStoreConfig } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useAuthStore } from '@/stores/auth.store'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'
import { useAppId } from '@/use/getAppId'
import { createTransactionSigner } from '@/utils/signerUtils'

const appsStore = useAppsStore()
const loaderStore = useLoaderStore()
const authStore = useAuthStore()
const route = useRoute()
const arcanaAuth = useArcanaAuth()
const isAuthLoaded = ref(false)
const appId = useAppId()

onBeforeMount(async () => {
  loaderStore.showLoader('Initializing Arcana Auth SDK...')
  await arcanaAuth.init()
  isAuthLoaded.value = true

  await fetchAndStoreConfig()

  loaderStore.showLoader('Fetching app configuration...')
  if (authStore.accessToken && appId) {
    await appsStore.fetchAndStoreAppConfig(appId)
    const app = appsStore.app(appId)
    createTransactionSigner(app.address)
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
    <AppFooter v-if="isAuthLoaded && !route.path.includes('/config/')" />
    <FullScreenLoader
      v-if="loaderStore.isLoading || !isAuthLoaded"
      :message="loaderStore.message"
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
