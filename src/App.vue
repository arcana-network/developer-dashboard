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
  <div class="root">
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

<style>
#app {
  height: 100vh;
  overflow-x: hidden;
}

.root {
  height: 100vh;
}

.banner {
  position: relative;
  padding: 0.25em 1.5em;
  line-height: 1.5em;
  color: white;
  text-align: center;
  background: linear-gradient(180deg, #0085ff -4.5%, #29c8fa 100.1%);
}

.banner h4 {
  display: inline-block;
  font-size: 1.125rem;
  font-weight: 600;
}

.banner h5 {
  display: inline-block;
  margin-right: 2em;
  margin-left: 1em;
  font-size: 1rem;
  font-weight: 400;
}

.banner.hide {
  display: none;
}

.banner-close {
  position: absolute;
  right: 2em;
  margin-top: 2px;
  cursor: pointer;
}
</style>
