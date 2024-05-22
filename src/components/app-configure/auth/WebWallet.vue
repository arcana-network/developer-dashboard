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
import { WalletUIModes, isProductionDashboard } from '@/utils/constants'
import { content, errors } from '@/utils/content'
import { useValidator } from '@/utils/validation'

const appsStore = useAppsStore()
const appId = useAppId()
const loaderStore = useLoaderStore()
const toast = useToast()
const app = appsStore.app(appId)
const wallet = app.auth.wallet
const isEdited = ref(false)
const validator = useValidator()

const appNetwork = isProductionDashboard
  ? app.network
  : app.network === 'mainnet'
  ? 'testnet'
  : 'dev'

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

const chosenWalletUIMode =
  WalletUIModes.find((mode) => mode.value === app.wallet_mode)?.label || '-'

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
  return !walletWebsiteDomain.value || validator.url(walletWebsiteDomain.value)
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
    loaderStore.showLoader(content.WALLET.SAVING)
    await updateApp(appId, { auth }, app.network)
    toast.success(content.WALLET.SUCCESS)
    app.auth.wallet = auth.wallet
  } catch (e) {
    toast.error(errors.WALLET.ERROR)
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
          <VStack direction="column" gap="1rem" class="flex-grow">
            <div class="text-lg font-normal text-grey">
              Secure Arcana wallet by restricting to load only in the context of
              the specified app domain. Arcana uses frame-ancestors CSP to
              restrict domains.
              <a
                href="https://developer.mozilla.org/en-US/docs/web/http/headers/content-security-policy#frame-ancestors"
                target="_blank"
              >
                READ MORE
              </a>
            </div>
            <div class="space-x-5 flex">
              <div class="flex flex-col space-y-3">
                <span>Domain URL</span>
                <VTextField
                  v-model.trim="walletWebsiteDomain"
                  class="web-wallet-input"
                  :icon="walletWebsiteDomain ? CloseIcon : ''"
                  :message-type="
                    isEdited && !isValidWebsiteDomain() ? 'error' : ''
                  "
                  message="Invalid website domain - must be a valid url"
                  clickable-icon
                  placeholder="Enter Domain URL"
                  @icon-clicked="clearWebsiteDomain()"
                  @blur="isEdited = true"
                />
              </div>
              <div class="flex flex-col space-y-3">
                <span>Wallet UI Mode</span>
                <VTextField
                  :model-value="chosenWalletUIMode"
                  :disabled="true"
                  input-style="color:#393939"
                />
              </div>
            </div>
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

.web-wallet-input {
  max-width: 24rem;
}
</style>
