<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'

const store = useStore()
const appName = computed(() => store.getters.appName)

function onAppNameChange(appName: string) {
  store.commit('updateAppName', appName)
}
</script>

<template>
  <section name="configure-app-name">
    <SettingCard>
      <template #title>Enter App Name</template>
      <VTextField
        :model-value="appName"
        class="app-name-input"
        no-message
        @update:model-value="onAppNameChange"
      />
    </SettingCard>
  </section>
</template>

<style scoped>
.app-name-input {
  max-width: 24rem;
}
</style>
