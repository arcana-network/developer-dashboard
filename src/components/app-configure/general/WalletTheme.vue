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
import { content, errors } from '@/utils/content'

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
    loaderStore.showLoader(content.WALLET.THEME.SAVING)
    await updateApp(appId, { auth }, app.network)
    toast.success(content.WALLET.THEME.SUCCESS)
    app.auth.wallet = auth.wallet
  } catch (e) {
    toast.error(errors.WALLET.THEME.ERROR)
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
        <VStack direction="column" gap="1rem" class="mb-4">
          <h3>Wallet Theme</h3>
          <VStack direction="column" gap="0.5rem" align="start">
            <h4 class="text-system-grey">Choose Theme</h4>
            <VDropdown
              v-model="selectedTheme"
              :options="availableThemes"
              display-field="label"
              class="min-w-rem16"
            />
          </VStack>
        </VStack>
        <VStack direction="column" gap="1rem">
          <h3>Branding Preview</h3>
          <VStack gap="2.5rem" wrap>
            <VStack direction="column" gap="0.5rem">
              <h4 class="text-system-grey">Desktop</h4>
              <img
                v-if="selectedTheme.value === 'light'"
                src="@/assets/web-wallet-preview-desktop-light.png"
                alt="Web wallet desktop preview"
                class="w-full max-w-rem38"
              />

              <img
                v-else
                src="@/assets/web-wallet-preview-desktop-dark.png"
                alt="Web wallet desktop preview"
                class="w-full max-w-rem38"
              />
            </VStack>
            <VSeperator vertical class="tablet-remove mobile-remove" />
            <VStack direction="column" gap="0.5rem">
              <h4 class="text-system-grey">Mobile</h4>
              <img
                v-if="selectedTheme.value === 'light'"
                src="@/assets/web-wallet-preview-mobile-light.png"
                alt="Web wallet mobile preview"
                class="w-full max-w-rem12"
              />
              <img
                v-else
                src="@/assets/web-wallet-preview-mobile-dark.png"
                alt="Web wallet mobile preview"
                class="w-full max-w-rem12"
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
