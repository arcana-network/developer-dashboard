<script lang="ts" setup>
import { ref } from 'vue'

import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import constants from '@/utils/constants'

const configureTabs = constants.configureTabs

const currentTab = ref(configureTabs.general)

function switchTab(tab) {
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
