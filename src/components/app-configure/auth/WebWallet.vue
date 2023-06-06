<script lang="ts" setup>
import { ref } from 'vue'

import CloseIcon from '@/assets/iconography/close.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { useAppsStore, type Theme } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import { walletUIModes } from '@/utils/constants'
import { isValidUrl } from '@/utils/validation'

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()
const app = appsStore.app(appId)
const wallet = app.auth.wallet
const isEdited = ref(false)
const choosenWalletUIMode = walletUIModes.find(
  (mode) => mode.value === app.walletMode
)?.label

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

function clearWebsiteDomain() {
  walletWebsiteDomain.value = ''
}

function handleCancel() {
  walletWebsiteDomain.value = wallet.websiteDomain
  isEdited.value = false
}

function isValidWebsiteDomain() {
  return !walletWebsiteDomain.value || isValidUrl(walletWebsiteDomain.value)
}

function hasSameValuesInStore() {
  return walletWebsiteDomain.value === wallet.websiteDomain
}

async function handleSave() {
  try {
    const { auth } = app
    wallet.websiteDomain = walletWebsiteDomain.value
    wallet.selectedTheme = selectedTheme.value.value
    auth.wallet = wallet
    loaderStore.showLoader('Saving wallet config...')
    await updateApp(appId, { auth }, app.network)
    toast.success('Saved wallet config')
    app.auth.wallet = auth.wallet
  } catch (e) {
    toast.error('Error occured while saving the wallet config.')
  } finally {
    loaderStore.hideLoader()
    isEdited.value = false
  }
}
</script>

<template>
  <section name="web-wallet">
    <SettingCard>
      <template #title>Arcana Wallet</template>
      <form @submit.prevent="handleSave">
        <VStack direction="column" gap="1rem">
          <VStack>
            <VStack direction="column" gap="1rem" class="flex-grow">
              <h3>Website Domain</h3>
              <div class="text-lg font-normal text-grey">
                Secure Arcana wallet by restricting to load only in the context
                of the specified app domain. Arcana uses frame-ancestors CSP to
                restrict domains.
                <a
                  href="https://developer.mozilla.org/en-US/docs/web/http/headers/content-security-policy#frame-ancestors"
                  target="_blank"
                >
                  READ MORE
                </a>
              </div>
              <VStack
                class="space-x-3 flex max-[1200px]:flex-col max-[1200px]:space-x-0 max-[1200px]:space-y-5"
              >
                <VStack direction="column" class="flex-1 space-y-2">
                  <VTextField
                    v-model.trim="walletWebsiteDomain"
                    :icon="walletWebsiteDomain ? CloseIcon : ''"
                    :message-type="
                      isEdited && !isValidWebsiteDomain() ? 'error' : ''
                    "
                    :no-message="!(isEdited && !isValidWebsiteDomain())"
                    message="Invalid website domain - must be a valid url"
                    clickable-icon
                    label="Enter Domain URL"
                    @icon-clicked="clearWebsiteDomain()"
                    @blur="isEdited = true"
                  />
                </VStack>
                <VStack direction="column" class="flex-1 space-y-2">
                  <VTextField
                    :no-message="true"
                    class="max-w-[10rem]"
                    :disabled="true"
                    label="Chosen UI Mode"
                    :model-value="choosenWalletUIMode"
                  />
                </VStack>
              </VStack>
            </VStack>
          </VStack>
          <ConfigureActionButtons
            :save-disabled="hasSameValuesInStore() || !isValidWebsiteDomain()"
            :cancel-disabled="hasSameValuesInStore()"
            @cancel="handleCancel"
          />
        </VStack>
      </form>
    </SettingCard>
  </section>
</template>

<style scoped>
.text-grey {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-grey);
}
</style>
