<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import VToast from '@/components/lib/VToast/VToast.vue'
import { fetchAndStoreConfig } from '@/services/gateway.service'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'
import { createTransactionSigner } from '@/utils/signerUtils'

const appStore = useAppStore()
const loaderStore = useLoaderStore()
const authStore = useAuthStore()
const route = useRoute()
const arcanaAuth = useArcanaAuth()
const isAuthLoaded = ref(false)

onBeforeMount(async () => {
  loaderStore.showLoader('Initializing Arcana Auth SDK...')
  await arcanaAuth.init()
  isAuthLoaded.value = true

  await fetchAndStoreConfig()

  loaderStore.showLoader('Fetching app configuration...')
  if (!appStore.appName && authStore.accessToken) {
    await appStore.fetchAppConfig()
    createTransactionSigner()
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
