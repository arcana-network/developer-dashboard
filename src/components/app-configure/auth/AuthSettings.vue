<script lang="ts" setup>
import { useRoute } from 'vue-router'

import IAMProviders from '@/components/app-configure/auth/IAMProviders.vue'
import RedirectURI from '@/components/app-configure/auth/RedirectURI.vue'
import SocialAuthProvider from '@/components/app-configure/auth/SocialAuthProvider.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore } from '@/stores/apps.store'

const route = useRoute()
const appId = Number(route.params.appId)
const appsStore = useAppsStore()
const app = appsStore.app(appId)
const GLOBAL_KEYSPACE = 'global'

const keyspace = app.keyspace
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <RedirectURI />
      <div class="relative">
        <div
          v-if="keyspace === GLOBAL_KEYSPACE"
          class="absolute bg-[#1F1F1F] opacity-90 w-full h-full flex justify-center items-center z-[999]"
        >
          <div
            class="bg-gray-950 w-1/2 h-72 flex justify-center items-center text-2xl text-center rounded-lg p-8"
          >
            <p>Login providers are disabled as you have chosen Global keys</p>
          </div>
        </div>
        <SocialAuthProvider />
        <IAMProviders />
      </div>
    </VStack>
  </main>
</template>
