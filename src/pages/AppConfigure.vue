<script lang="ts" setup>
import { ref, type Ref } from 'vue'

import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import GeneralSettings from '@/components/app-configure/general/GeneralSettings.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import type { ConfigureTab } from '@/utils/constants'

const currentTab: Ref<ConfigureTab> = ref('general')

function switchTab(tab: ConfigureTab) {
  currentTab.value = tab
}
</script>

<template>
  <VStack gap="2rem" class="container">
    <ConfigureSidebar :current-tab="currentTab" @switch-tab="switchTab" />
    <GeneralSettings v-if="currentTab === 'general'" />
  </VStack>
</template>

<style scoped>
main {
  flex-grow: 1;
}
</style>
