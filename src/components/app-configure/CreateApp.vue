<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'
import { createApp } from '@/services/gateway.service'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { RegionMapping, regions, type Region, api } from '@/utils/constants'
import { createTransactionSigner } from '@/utils/signerUtils'

const router = useRouter()
const loaderStore = useLoaderStore()
const toast = useToast()
const appsStore = useAppsStore()
const appName = ref('')
const hasAppNameError = ref(false)
const selectedRegion = ref(regions[0])
const emit = defineEmits(['close'])

function handleRegionChange(option: Region) {
  selectedRegion.value = option
}

async function handleCreateApp() {
  try {
    if (!appName.value?.trim()) {
      hasAppNameError.value = true
      return
    }
    emit('close')
    loaderStore.showLoader('Creating App...')
    hasAppNameError.value = false
    const app = (
      await createApp({
        name: appName.value,
        region: RegionMapping[selectedRegion.value.value],
      })
    ).data.app

    appsStore.addApp(app.ID, {
      id: app.ID,
      name: app.name as string,
      address: app.address as string,
      totalUsers: 0,
      logos: {
        dark: {
          horizontal: '',
          vertical: '',
        },
        light: {
          horizontal: '',
          vertical: '',
        },
      },
      access: {
        selectedChain: 'none',
      },
      auth: {
        social: [],
        wallet: {
          walletType: app.wallet_type,
          walletTypeInGateway: app.wallet_type,
          websiteDomain: app.wallet_domain,
          selectedTheme: app.theme || 'dark',
        },
        redirectUri: `${api.verify}/${app.ID}/`,
      },
    })
    createTransactionSigner(app.address)
    loaderStore.hideLoader()
    appsStore.setSelectedAppId(app.ID)
    router.push({ name: 'AppDetails', params: { appId: app.ID } })
  } catch (e) {
    loaderStore.hideLoader()
    console.error(e)
    toast.error('Error occurred while creating app')
  }
}
</script>

<template>
  <VOverlay>
    <VCard variant="popup" class="create-app-modal-card">
      <img
        src="@/assets/iconography/close.svg"
        class="close-btn"
        @click.stop="emit('close')"
      />
      <h2 class="create-app-title">Create New App</h2>
      <VSeperator />
      <form @submit.prevent="handleCreateApp">
        <VStack direction="column">
          <VStack direction="column" gap="1rem">
            <label class="app-name-label" for="app-name">Enter App Name</label>
            <VTextField
              id="app-name"
              v-model.trim="appName"
              class="app-name-input"
              :message-type="hasAppNameError ? 'error' : ''"
              message="App Name cannot be empty"
            />
          </VStack>
          <VStack direction="column" gap="1rem" align="start">
            <VStack gap="0.5rem">
              <label class="app-name-label" for="app-region"
                >Choose Region</label
              >
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
              id="app-region"
              :options="regions"
              display-field="name"
              class="region-dropdown"
              :model-value="selectedRegion"
              @update:model-value="handleRegionChange"
            />
          </VStack>
          <VButton
            type="submit"
            label="CREATE"
            class="create-button"
            :disabled="!appName?.trim()"
          />
        </VStack>
      </form>
    </VCard>
  </VOverlay>
</template>

<style scoped>
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

.close-btn {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  width: 1rem;
  cursor: pointer;
}
</style>
