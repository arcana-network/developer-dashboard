<script lang="ts" setup>
import { computed } from 'vue'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'

const appsStore = useAppsStore()
const appId = useAppId()

const appName = computed(() => appsStore.app(appId).name)

function onAppNameChange(appName: string) {
  const app = appsStore.app(appId)
  app.name = appName
  appsStore.updateApp(appId, app)
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
