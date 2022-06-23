<script lang="ts" setup>
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import { createApp, type AppConfig } from '@/services/gateway.service'
import {
  RegionMapping,
  regions,
  type Region,
  type StorageRegion,
} from '@/utils/constants'

const store = useStore()
const router = useRouter()
const appName: ComputedRef<string> = computed(() => store.getters.appName)
const hasAppNameError: Ref<boolean> = ref(false)
const selectedRegion: ComputedRef<Region | undefined> = computed(() => {
  const storageRegion: StorageRegion = store.getters.storageRegion
  return regions.find((region) => region.value === storageRegion)
})

function handleRegionChange(option: Region) {
  store.commit('updateStorageRegion', option.value)
}

function handleAppNameChange(appName: string) {
  store.commit('updateAppName', appName)
}

async function handleCreateApp() {
  if (!appName.value?.trim()) {
    hasAppNameError.value = true
    return
  }
  store.commit('showLoader', 'Creating App...')
  hasAppNameError.value = false
  const app: AppConfig = (
    await createApp({
      name: appName.value,
      region: RegionMapping[selectedRegion.value.value],
    })
  ).data
  store.commit('updateAppId', app.ID)
  await store.dispatch('fetchAppConfig')
  store.commit('hideLoader')
  router.push({ name: 'GeneralSettings' })
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
        dApp's data assets reside, for compliance and regulatory purpose. Once a
        region has been selected it cannot be altered."
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
