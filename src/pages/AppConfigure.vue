<script lang="ts" setup>
import { ref, type Ref } from 'vue'

import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import type { ConfigureTab } from '@/utils/constants'

const currentTab: Ref<ConfigureTab> = ref('general')

function switchTab(tab: ConfigureTab) {
  currentTab.value = tab
}
</script>

<template>
  <div class="container">
    <main>
      <ConfigureSidebar :current-tab="currentTab" @switch-tab="switchTab" />
    </main>
  </div>
</template>
