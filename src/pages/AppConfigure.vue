<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ConfigureHeader from '@/components/app-configure/ConfigureHeader.vue'
import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppId } from '@/use/getAppId'
import type { ConfigureTab, ConfigureTabType } from '@/utils/constants'

const currentTab: Ref<ConfigureTabType> = ref('Branding')
const router = useRouter()
const route = useRoute()
const appId = useAppId()

currentTab.value = String(route.name)
  .replace('Settings', '')
  .toLowerCase() as ConfigureTabType

function switchTab(tab: ConfigureTab) {
  currentTab.value = tab.type
  router.push({
    name: `${tab.label}Settings`,
    params: { appId },
  })
}
</script>

<template>
  <VStack direction="column" gap="2rem" class="min-h-screen">
    <ConfigureHeader />
    <VStack gap="2rem" class="container mb-8">
      <RouterView />
    </VStack>
  </VStack>
</template>
