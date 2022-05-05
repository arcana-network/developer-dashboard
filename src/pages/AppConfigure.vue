<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import type { ConfigureTab, ConfigureTabType } from '@/utils/constants'

const currentTab: Ref<ConfigureTabType> = ref('general')
const router = useRouter()

function switchTab(tab: ConfigureTab) {
  currentTab.value = tab.type
  router.replace({ name: `${tab.label}Settings` })
}
</script>

<template>
  <VStack gap="2rem" class="container">
    <ConfigureSidebar :current-tab="currentTab" @switch-tab="switchTab" />
    <router-view></router-view>
  </VStack>
</template>
