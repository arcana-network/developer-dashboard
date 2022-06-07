<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import CloseIcon from '@/assets/iconography/close.svg'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'

const store = useStore()

type Theme = {
  label: string
  value: 'light' | 'dark'
}

const availableThemes: Theme[] = [
  {
    label: 'Light Mode',
    value: 'light',
  },
  {
    label: 'Dark Mode',
    value: 'dark',
  },
]

const selectedTheme: ComputedRef<Theme | undefined> = computed(() => {
  return availableThemes.find(
    (theme) => theme.value === store.getters.selectedTheme
  )
})

const walletWebsiteDomain: ComputedRef<string> = computed(
  () => store.getters.walletWebsiteDomain
)
const hasUIMode: ComputedRef<boolean> = computed(
  () => store.getters.walletUIMode
)
const hasUIModeInGateway: ComputedRef<boolean> = computed(
  () => store.getters.walletUIModeInGateway
)

function handleThemeChange(theme: Theme) {
  store.commit('updateSelectedTheme', theme.value)
}

function handleWebsiteDomainUpdate(value: string) {
  store.commit('updateWalletWebsiteDomain', value)
}

function handleClearWebsiteDomain() {
  store.commit('updateWalletWebsiteDomain', '')
}

function handleUIModeUpdate(value: boolean) {
  store.commit('updateWalletUIMode', value)
}
</script>

<template>
  <section name="web-wallet">
    <SettingCard>
      <template #title>Wallet</template>
      <VStack direction="column" gap="3rem">
        <VStack direction="column" gap="1rem" class="flex-grow">
          <h3 class="text-uppercase">Website Domain</h3>
          <div class="body-1">
            Set your website domain here. It's used by the server to restrict
            wallet from loading anywhere else other than what you specify, for
            security. It uses frame-ancestor CSP to restrict domains. For more
            <a
              href="https://developer.mozilla.org/en-US/docs/web/http/headers/content-security-policy#frame-ancestors"
              target="_blank"
              >details</a
            >
          </div>
          <VTextField
            class="web-wallet-input"
            :icon="walletWebsiteDomain ? CloseIcon : ''"
            no-message
            :model-value="walletWebsiteDomain"
            clickable-icon
            @update:model-value="handleWebsiteDomainUpdate"
            @icon-clicked="handleClearWebsiteDomain"
          />
        </VStack>
        <VStack direction="column" gap="1rem">
          <VStack justify="space-between">
            <h3 class="text-uppercase">UI Mode</h3>
            <VStack align="center" gap="0.625rem">
              <span class="body-1 font-300" :class="{ 'font-700': !hasUIMode }"
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
            Choose theme and enable UI mode for the wallet.
            <a>Learn more about UI Modes for Web Wallet → Web Wallet</a>
          </div>
          <VStack
            v-if="hasUIMode"
            direction="column"
            gap="0.75rem"
            align="start"
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
      </VStack>
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
