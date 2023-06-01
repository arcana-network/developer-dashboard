<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

import FullScreenLoader from '@/components/FullScreenLoader.vue'
import VToast from '@/components/lib/VToast/VToast.vue'
import { fetchAndStoreConfig } from '@/services/gateway.service'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'
import constants from '@/utils/constants'

const loaderStore = useLoaderStore()
const router = useRouter()
const arcanaAuth = useArcanaAuth()
const isAuthLoaded = ref(false)

function toBoolean(val: string | boolean | number): boolean {
  if (typeof val === 'string') {
    if (val === '0' || val === 'false') {
      return false
    }
  }
  return !!val
}

onBeforeMount(async () => {
  if (toBoolean(constants.isAppDown)) {
    isAuthLoaded.value = true
    return router.push({ name: 'AppDown' })
  }
  loaderStore.showLoader('Initializing Arcana Auth SDK...')
  await fetchAndStoreConfig()
  await arcanaAuth.init()
  isAuthLoaded.value = true
  loaderStore.hideLoader()
})
</script>

<template>
  <div class="root relative">
    <div class="sticky top-0 left-0 z-[2147483647] bg-[#13a3fd] w-full p-2">
      Testnet update will happen from 12:30 PM UTC to 3:00 PM UTC so users may
      face disruption in service. Mainnet apps will NOT be affected
    </div>
    <router-view
      v-if="isAuthLoaded"
      v-slot="{ Component }"
      style="min-height: 100vh"
    >
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
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
</style>
