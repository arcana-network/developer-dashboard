<script lang="ts" setup>
import { ref } from 'vue'

import CloseIcon from '@/assets/iconography/close.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useToast } from '@/components/lib/VToast'
import { updateApp } from '@/services/gateway.service'
import { useAppsStore, type Theme } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
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

function clearWebsiteDomain() {
  walletWebsiteDomain.value = ''
}

function handleCancel() {
  walletWebsiteDomain.value = wallet.websiteDomain
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
    selectedTheme.value.value === wallet.selectedTheme
  )
}

async function handleSave() {
  try {
    const { auth } = app
    wallet.websiteDomain = walletWebsiteDomain.value
    wallet.selectedTheme = selectedTheme.value.value
    auth.wallet = wallet
    loaderStore.showLoader('Saving wallet config...')
    await updateApp(appId, { auth })
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
      <template #title>Wallet</template>
      <form @submit.prevent="handleSave">
        <VStack direction="column" gap="1rem">
          <VStack direction="column" gap="1rem" class="flex-grow">
            <h3>Website Domain</h3>
            <div class="body-1 text-grey">
              Set your website domain here. It is used for security reasons by
              the server, to restrict Arcana wallet from loading anywhere else
              other than the domain you specify. We use frame-ancestor CSP to
              restrict domains.
              <a
                href="https://developer.mozilla.org/en-US/docs/web/http/headers/content-security-policy#frame-ancestors"
                target="_blank"
                class="learn-more"
              >
                LEARN MORE
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
              <VSeperator vertical />
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
