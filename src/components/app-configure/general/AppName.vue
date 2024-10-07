<script lang="ts" setup>
import { ref } from 'vue'

import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import { content, errors } from '@/utils/content'

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()

const app = appsStore.app(appId)
const appName = ref(app.name)

function isValidAppName() {
  return !!appName.value
}

function hasSameAppName() {
  return appName.value === app.name
}

async function handleSave() {
  try {
    loaderStore.showLoader(content.APP.APP_NAME.SAVING)
    await updateApp(appId, { name: appName.value }, app.network)
    toast.success(content.APP.APP_NAME.SUCCESS)
    app.name = appName.value
  } catch (e) {
    toast.error(errors.APP.APP_NAME.ERROR)
  } finally {
    loaderStore.hideLoader()
  }
}

function handleCancel() {
  appName.value = app.name
}
</script>

<template>
  <section name="configure-app-name">
    <SettingCard>
      <template #title>App Name</template>
      <form @submit.prevent="handleSave">
        <VTextField
          v-model.trim="appName"
          class="w-full max-w-rem22"
          :message-type="!isValidAppName() ? 'error' : ''"
          message="App name cannot be empty"
        />
        <ConfigureActionButtons
          :save-disabled="!isValidAppName() || hasSameAppName()"
          :cancel-disabled="hasSameAppName()"
          @cancel="handleCancel"
        />
      </form>
    </SettingCard>
  </section>
</template>
