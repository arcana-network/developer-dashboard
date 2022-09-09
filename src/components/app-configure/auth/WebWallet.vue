<script lang="ts" setup>
import { computed } from 'vue'

import CloseIcon from '@/assets/iconography/close.svg'
import ConfigureActionButtons from '@/components/app-configure/ConfigureActionButtons.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { useAppsStore, type Theme } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import constants, { WalletMode } from '@/utils/constants'

const appsStore = useAppsStore()
const appId = useAppId()

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

const selectedTheme = computed(() => {
  return availableThemes.find(
    (theme) => theme.value === appsStore.app(appId).auth.wallet.selectedTheme
  )
})

const walletWebsiteDomain = computed(
  () => appsStore.app(appId).auth.wallet.websiteDomain
)
const hasUIMode = computed(() => appsStore.hasUiMode(appId))
const hasUIModeInGateway = computed(() => appsStore.hasUiModeInGateway(appId))

function handleThemeChange(theme: ThemeData) {
  const app = appsStore.app(appId)
  app.auth.wallet.selectedTheme = theme.value
  appsStore.updateApp(appId, app)
}

function handleWebsiteDomainUpdate(value: string) {
  const app = appsStore.app(appId)
  app.auth.wallet.websiteDomain = value
  appsStore.updateApp(appId, app)
}

function handleUIModeUpdate(value: boolean) {
  const app = appsStore.app(appId)
  app.auth.wallet.walletType = value ? WalletMode.UI : WalletMode.NoUI
  appsStore.updateApp(appId, app)
}
</script>

<template>
  <section name="web-wallet">
    <SettingCard>
      <template #title>Wallet</template>
      <form>
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
              class="web-wallet-input"
              :icon="walletWebsiteDomain ? CloseIcon : ''"
              no-message
              :model-value="walletWebsiteDomain"
              clickable-icon
              @update:model-value="handleWebsiteDomainUpdate"
              @icon-clicked="handleWebsiteDomainUpdate('')"
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
                  :model-value="hasUIMode"
                  class="ui-mode-switch"
                  :disabled="hasUIModeInGateway"
                  @update:model-value="handleUIModeUpdate"
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
                :options="availableThemes"
                display-field="label"
                :model-value="selectedTheme"
                class="theme-dropdown"
                @update:model-value="handleThemeChange"
              />
            </VStack>
          </VStack>
          <VStack v-if="hasUIMode" direction="column" gap="1rem">
            <h3 class="text-uppercase">Preview Interface</h3>
            <VStack gap="2.5rem" wrap>
              <VStack direction="column" gap="0.625rem">
                <h4>Desktop</h4>
                <img
                  v-if="selectedTheme?.value === 'light'"
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
                  v-if="selectedTheme?.value === 'light'"
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
          <ConfigureActionButtons />
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
