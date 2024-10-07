<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter, RouterView } from 'vue-router'

import FullScreenLoader from '@/components/FullScreenLoader.vue'
import VToast from '@/components/lib/VToast/VToast.vue'
import { fetchAndStoreConfig } from '@/services/gateway.service'
import { useLoaderStore } from '@/stores/loader.store'
import useArcanaAuth from '@/use/arcanaAuth'
import constants from '@/utils/constants'
import { content } from '@/utils/content'

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
  loaderStore.showLoader(content.INITIALISATION)
  await fetchAndStoreConfig()
  await arcanaAuth.init()
  isAuthLoaded.value = true
  loaderStore.hideLoader()
})
</script>

<template>
  <div class="h-screen overflow-x-hidden">
    <RouterView v-if="isAuthLoaded" v-slot="{ Component }" class="min-h-screen">
      <Transition name="fade" mode="out-in">
        <Component :is="Component" />
      </Transition>
    </RouterView>
    <FullScreenLoader
      v-if="loaderStore.isLoading || !isAuthLoaded"
      :message="loaderStore.message"
    />
    <VToast />
  </div>
</template>
