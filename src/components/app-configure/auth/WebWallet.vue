<script lang="ts" setup>
import { ref } from 'vue'

import CloseIcon from '@/assets/iconography/close.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { enableUiMode } from '@/services/smart-contract.service'
import { useAppsStore, type Theme } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import constants, { WalletMode } from '@/utils/constants'
import { isValidUrl } from '@/utils/validation'

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
const hasUIMode = ref(wallet.walletType === WalletMode.UI)

function clearWebsiteDomain() {
  walletWebsiteDomain.value = ''
}

function handleCancel() {
  walletWebsiteDomain.value = wallet.websiteDomain
  hasUIMode.value = wallet.walletType === WalletMode.UI
  selectedTheme.value = availableThemes.find(
    (theme) => theme.value === wallet.selectedTheme
  ) as ThemeData
  isEdited.value = false
}

function isValidWebsiteDomain() {
  return !walletWebsiteDomain.value || isValidUrl(walletWebsiteDomain.value)
}

function hasSameValuesInStore() {
  return (
    walletWebsiteDomain.value === wallet.websiteDomain &&
    selectedTheme.value.value === wallet.selectedTheme &&
    hasUIMode.value === (wallet.walletType === WalletMode.UI)
  )
}

async function handleSave() {
  try {
    const { auth } = app
    auth.wallet.websiteDomain = walletWebsiteDomain.value
    auth.wallet.walletType = hasUIMode.value ? WalletMode.UI : WalletMode.NoUI
    auth.wallet.selectedTheme = selectedTheme.value.value
    loaderStore.showLoader('Saving wallet config...')
    await updateApp(appId, { ...app, ...auth })
    toast.success('Saved wallet config')
    if (auth.wallet.walletType !== app.auth.wallet.walletType) {
      loaderStore.showLoader('Enabling UI mode in smart contract...')
      await enableUiMode()
      toast.success('UI mode enabled in blockchain')
    }
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
      <template #title>Wallet</template>
      <form @submit.prevent="handleSave">
        <VStack direction="column" gap="2rem">
          <VStack direction="column" gap="1rem" class="flex-grow">
            <h3 class="text-uppercase">Website Domain</h3>
            <div class="body-1">
              Set your website domain here. It is used for security reasons by
              the server, to restrict Arcana wallet from loading anywhere else
              other than the domain you specify. We use frame-ancestor CSP to
              restrict domains.
              <br />
              <a
                href="https://developer.mozilla.org/en-US/docs/web/http/headers/content-security-policy#frame-ancestors"
                target="_blank"
                class="learn-more"
              >
                Learn More...
              </a>
            </div>
            <VTextField
              v-model.trim="walletWebsiteDomain"
              class="web-wallet-input"
              :icon="walletWebsiteDomain ? CloseIcon : ''"
              :message-type="isEdited && !isValidWebsiteDomain() ? 'error' : ''"
              message="Invalid website domain - must be a valid url"
              clickable-icon
              @icon-clicked="clearWebsiteDomain()"
              @blur="isEdited = true"
            />
          </VStack>
          <VStack direction="column" gap="1rem">
            <VStack justify="space-between">
              <h3 class="text-uppercase">UI Mode</h3>
              <VStack align="center" gap="0.625rem">
                <span
                  class="body-1 font-300"
                  :class="{ 'font-700': !hasUIMode }"
                  >Disable</span
                >
                <VSwitch
                  v-model="hasUIMode"
                  class="ui-mode-switch"
                  :disabled="wallet.walletType === WalletMode.UI"
                />
                <span class="body-1 font-300" :class="{ 'font-700': hasUIMode }"
                  >Enable</span
                >
              </VStack>
            </VStack>
            <div class="body-1">
              Configure dApp user experience while signing blockchain
              transactions for storage operations by selecting the appropriate
              Arcana wallet UI mode.
              <br />
              <a
                :href="`${constants.DOCS_URL}/docs/arcanawallet#arcana-wallet-ui-modes`"
                target="_blank"
                class="learn-more"
              >
                Learn More...
              </a>
            </div>
            <VStack
              v-if="hasUIMode"
              direction="column"
              gap="0.75rem"
              align="start"
              style="margin-top: 1rem"
            >
              <h4 class="text-grey">Choose Theme</h4>
              <VDropdown
                v-model="selectedTheme"
                :options="availableThemes"
                display-field="label"
                class="theme-dropdown"
              />
            </VStack>
          </VStack>
          <VStack v-if="hasUIMode" direction="column" gap="1rem">
            <h3 class="text-uppercase">Preview Interface</h3>
            <VStack gap="2.5rem" wrap>
              <VStack direction="column" gap="0.625rem">
                <h4>Desktop</h4>
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
              <VSeperator vertical />
              <VStack direction="column" gap="0.625rem">
                <h4>Mobile</h4>
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
.theme-dropdown {
  min-width: 16rem;
}

.text-grey {
  color: var(--text-grey);
}

.web-wallet-input {
  max-width: 24rem;
}

.ui-mode-switch {
  margin-top: 4px;
}

.web-wallet-desktop-preview {
  max-width: 38rem;
}

.web-wallet-mobile-preview {
  max-width: 12rem;
}
</style>
