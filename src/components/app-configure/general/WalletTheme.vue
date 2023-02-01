<script lang="ts" setup>
import { ref } from 'vue'

import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { useAppsStore, type Theme } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()
const app = appsStore.app(appId)
const wallet = app.auth.wallet
const isEdited = ref(false)

type ThemeData = {
  label: string
  value: Theme
}

const availableThemes: ThemeData[] = [
  {
    label: 'Light Mode',
    value: 'light',
  },
  {
    label: 'Dark Mode',
    value: 'dark',
  },
]

const selectedTheme = ref(
  availableThemes.find(
    (theme) => theme.value === wallet.selectedTheme
  ) as ThemeData
)

const walletWebsiteDomain = ref(wallet.websiteDomain)

function handleCancel() {
  selectedTheme.value = availableThemes.find(
    (theme) => theme.value === wallet.selectedTheme
  ) as ThemeData
  isEdited.value = false
}

function hasSameValuesInStore() {
  return selectedTheme.value.value === wallet.selectedTheme
}

async function handleSave() {
  try {
    const { auth } = app
    wallet.websiteDomain = walletWebsiteDomain.value
    wallet.selectedTheme = selectedTheme.value.value
    auth.wallet = wallet
    loaderStore.showLoader('Saving wallet theme...')
    await updateApp(appId, { auth }, app.network)
    toast.success('Saved wallet theme')
    app.auth.wallet = auth.wallet
  } catch (e) {
    toast.error('Error occured while saving the wallet theme.')
  } finally {
    loaderStore.hideLoader()
    isEdited.value = false
  }
}
</script>

<template>
  <section name="web-wallet">
    <form @submit.prevent="handleSave">
      <VStack direction="column" gap="1rem">
        <VStack direction="column" gap="1rem" style="margin-bottom: 1rem">
          <h3>Wallet Theme</h3>
          <VStack direction="column" gap="0.5rem" align="start">
            <h4 class="text-grey">Choose Theme</h4>
            <VDropdown
              v-model="selectedTheme"
              :options="availableThemes"
              display-field="label"
              class="theme-dropdown"
            />
          </VStack>
        </VStack>
        <VStack direction="column" gap="1rem">
          <h3>Preview Interface</h3>
          <VStack gap="2.5rem" wrap>
            <VStack direction="column" gap="0.5rem">
              <h4 class="text-grey">Desktop</h4>
              <img
                v-if="selectedTheme.value === 'light'"
                src="@/assets/web-wallet-preview-desktop-light.png"
                alt="Web wallet desktop preview"
                class="web-wallet-desktop-preview"
              />
              <img
                v-else
                src="@/assets/web-wallet-preview-desktop-dark.png"
                alt="Web wallet desktop preview"
                class="web-wallet-desktop-preview"
              />
            </VStack>
            <VSeperator vertical class="tablet-remove mobile-remove" />
            <VStack direction="column" gap="0.5rem">
              <h4 class="text-grey">Mobile</h4>
              <img
                v-if="selectedTheme.value === 'light'"
                src="@/assets/web-wallet-preview-mobile-light.png"
                alt="Web wallet mobile preview"
                class="web-wallet-mobile-preview"
              />
              <img
                v-else
                src="@/assets/web-wallet-preview-mobile-dark.png"
                alt="Web wallet mobile preview"
                class="web-wallet-mobile-preview"
              />
            </VStack>
          </VStack>
        </VStack>
        <ConfigureActionButtons
          :save-disabled="hasSameValuesInStore()"
          :cancel-disabled="hasSameValuesInStore()"
          @cancel="handleCancel"
        />
      </VStack>
    </form>
  </section>
</template>

<style scoped>
.theme-dropdown {
  min-width: 16rem;
}

.text-grey {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-grey);
}

.web-wallet-input {
  max-width: 24rem;
}

.ui-mode-switch {
  margin-top: 4px;
}

.web-wallet-desktop-preview {
  width: 100%;
  max-width: 38rem;
}

.web-wallet-mobile-preview {
  width: 100%;
  max-width: 12rem;
}
</style>
