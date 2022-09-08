<script lang="ts" setup>
import { computed, ref } from 'vue'

import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { setAppConfig } from '@/services/smart-contract.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()
const isSaveDisabled = computed(
  () => !isValidAppName() || hasSameAppName(appsStore.app(appId).name)
)

const isCancelDisabled = computed(() =>
  hasSameAppName(appsStore.app(appId).name)
)

const appName = ref(appsStore.app(appId).name)

function isValidAppName() {
  return !!appName.value
}

function hasSameAppName(appNameInStore: string) {
  return appName.value === appNameInStore
}

async function handleSave() {
  const app = appsStore.app(appId)
  if (isValidAppName() && hasSameAppName(app.name)) {
    try {
      loaderStore.showLoader('Saving app name...')
      await updateApp(appId, { ...app, name: appName.value })
      toast.success('Updated app name')
      loaderStore.showLoader('Updating app config in smart contract...')
      await setAppConfig(app.name, app.auth.social)
      toast.success('App config saved in blockchain')
      app.name = appName.value
    } catch (e) {
      toast.error('Error occured while updating the app name.')
    } finally {
      loaderStore.hideLoader()
    }
  }
}

function handleCancel() {
  appName.value = appsStore.app(appId).name
}
</script>

<template>
  <section name="configure-app-name">
    <SettingCard>
      <template #title>App Name</template>
      <form @submit.prevent="handleSave">
        <VTextField v-model.trim="appName" class="app-name-input" no-message />
        <ConfigureActionButtons
          :save-disabled="isSaveDisabled"
          :cancel-disabled="isCancelDisabled"
          @cancel="handleCancel"
        />
      </form>
    </SettingCard>
  </section>
</template>

<style scoped>
.app-name-input {
  max-width: 24rem;
}
</style>
