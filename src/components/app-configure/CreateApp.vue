<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import { createApp, type AppConfig } from '@/services/gateway.service'
import { useAppStore } from '@/stores/app.store'
import { useLoaderStore } from '@/stores/loader.store'
import {
  RegionMapping,
  regions,
  type Region,
  type StorageRegion,
} from '@/utils/constants'
import { createTransactionSigner } from '@/utils/signerUtils'

const appStore = useAppStore()
const loaderStore = useLoaderStore()
const router = useRouter()
const appName = computed(() => appStore.appName)
const hasAppNameError = ref(false)
const selectedRegion = computed(() => {
  const storageRegion: StorageRegion = appStore.store.region
  return regions.find((region) => region.value === storageRegion) as Region
})

function handleRegionChange(option: Region) {
  appStore.updateStorageRegion(option.value)
}

function handleAppNameChange(appName: string) {
  appStore.updateAppName(appName)
}

async function handleCreateApp() {
  if (!appName.value?.trim()) {
    hasAppNameError.value = true
    return
  }
  loaderStore.showLoader('Creating App...')
  hasAppNameError.value = false
  const app: AppConfig = (
    await createApp({
      name: appName.value,
      region: RegionMapping[selectedRegion.value.value],
    })
  ).data
  appStore.appId = String(app.ID)

  await appStore.fetchAppConfig()
  createTransactionSigner()
  loaderStore.hideLoader()
  router.push({ name: 'GeneralSettings', params: { appId: appStore.appId } })
}
</script>

<template>
  <section name="create-app" class="create-app-section">
    <VCard variant="popup" class="create-app-modal-card">
      <h2 class="create-app-title">Create New App</h2>
      <VSeperator />
      <VStack direction="column" gap="1rem">
        <label class="app-name-label">Enter App Name</label>
        <VTextField
          :model-value="appName"
          class="app-name-input"
          :message-type="hasAppNameError ? 'error' : ''"
          message="App Name cannot be empty"
          @update:model-value="handleAppNameChange"
        />
      </VStack>
      <VStack direction="column" gap="1rem" align="start">
        <VStack gap="0.5rem">
          <label class="app-name-label">Choose Region</label>
          <VTooltip
            title="Arcana Store uses physical storage nodes that are logically grouped by
        geography. This allows you to control the region or location where
        dApp's data assets reside, for compliance and regulatory purpose. <strong>Once a
        region has been selected it cannot be altered.</strong>"
          >
            <img
              src="@/assets/iconography/info-circle-outline.svg"
              style="cursor: pointer"
            />
          </VTooltip>
        </VStack>
        <VDropdown
          :options="regions"
          display-field="name"
          class="region-dropdown"
          :model-value="selectedRegion"
          @update:model-value="handleRegionChange"
        />
      </VStack>
      <VButton
        label="CREATE"
        class="create-button"
        :disabled="!appName?.trim()"
        @click.stop="handleCreateApp"
      />
    </VCard>
  </section>
</template>

<style scoped>
.create-app-section {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgb(10 10 10 / 72%);
}

.create-app-modal-card {
  position: fixed;
  top: 50%;
  left: 50%;
  flex-direction: column;
  gap: 1rem;
  width: 72%;
  min-width: 200px;
  max-width: 560px;
  padding: 3rem;
  transform: translate(-50%, -50%);
}

.create-app-title {
  font-family: var(--font-body);
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
}

.app-name-label {
  font-family: var(--font-body);
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--text-grey);
}

.create-button {
  align-self: center;
  padding: 1rem 4rem;
  margin-top: 2rem;
}

.region-dropdown {
  width: 100%;
}
</style>
