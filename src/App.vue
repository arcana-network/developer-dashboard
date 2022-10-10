<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/AppFooter.vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import VToast from '@/components/lib/VToast/VToast.vue'
import { fetchAndStoreConfig } from '@/services/gateway.service'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'

const loaderStore = useLoaderStore()
const route = useRoute()
const arcanaAuth = useArcanaAuth()
const isAuthLoaded = ref(false)

onBeforeMount(async () => {
  loaderStore.showLoader('Initializing Arcana Auth SDK...')
  await arcanaAuth.init()
  isAuthLoaded.value = true
  await fetchAndStoreConfig()
  loaderStore.hideLoader()
})
</script>

<template>
  <div class="root flex flex-column justify-space-between">
    <router-view
      v-if="isAuthLoaded"
      v-slot="{ Component }"
      class="flex flex-column flex-grow"
    >
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <AppFooter v-if="isAuthLoaded && !route.path.includes('/config/')" />
  </div>
  <FullScreenLoader
    v-if="loaderStore.isLoading || !isAuthLoaded"
    :message="loaderStore.message"
  />
  <VToast />
</template>

<style>
#app {
  height: 100vh;
  overflow-x: hidden;
}

.root {
  min-height: 100vh;
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
