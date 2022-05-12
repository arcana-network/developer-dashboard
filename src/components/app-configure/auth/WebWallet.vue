<script lang="ts" setup>
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useStore } from 'vuex'

import CloseIcon from '@/assets/iconography/close.svg'
import CopyIcon from '@/assets/iconography/copy.svg'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import copyToClipboard from '@/utils/copyToClipboard'

const store = useStore()

const walletWebsiteDomain: ComputedRef<string> = computed(
  () => store.getters.walletWebsiteDomain
)
const walletRedirectUri: Ref<string> = ref(store.getters.walletRedirectUri)
const walletUIMode: ComputedRef<boolean> = computed(
  () => store.getters.walletUIMode
)

function handleWebsiteDomainUpdate(value: string) {
  store.commit('updateWalletWebsiteDomain', value)
}

function clearWalletWebsiteDomain() {
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
      <template #description
        >Allow your users to authenticate themselves by signing transactions
        using Arcana wallet. <a>LEARN MORE</a></template
      >
      <VStack gap="2rem" wrap>
        <VStack direction="column" gap="0.625rem" class="flex-grow">
          <label>Website Domain</label>
          <VTextField
            class="web-wallet-input"
            :icon="CloseIcon"
            no-message
            :model-value="walletWebsiteDomain"
            clickable-icon
            @update:model-value="handleWebsiteDomainUpdate"
            @icon-clicked="clearWalletWebsiteDomain"
          />
        </VStack>
        <VStack direction="column" gap="0.625rem" class="flex-grow">
          <label>Redirect URI</label>
          <VTextField
            class="web-wallet-input"
            :icon="CopyIcon"
            disabled
            no-message
            :model-value="walletRedirectUri"
            clickable-icon
            @icon-clicked="copyToClipboard(walletRedirectUri)"
          />
        </VStack>
      </VStack>
      <VStack gap="2rem" align="start">
        <h4 class="text-uppercase">UI Mode</h4>
        <VSwitch
          :model-value="walletUIMode"
          @update:model-value="handleUIModeUpdate"
        />
      </VStack>
      <div class="body-1">
        Some User Interface (UI) elements will be visible on your application's
        interface if this mode is enabled. Please define the following settings
        to style the interface so that it suits your application best.
        <a>LEARN MORE</a>
      </div>
      <h3 class="text-uppercase">Preview Interface</h3>
      <VStack gap="2.5rem" wrap>
        <VStack direction="column" gap="0.625rem">
          <h4>Desktop</h4>
          <img
            src="@/assets/web-wallet-preview-desktop.png"
            alt="Web wallet desktop preview"
            class="web-wallet-desktop-preview"
          />
        </VStack>
        <VSeperator vertical />
        <VStack direction="column" gap="0.625rem">
          <h4>Mobile</h4>
          <img
            src="@/assets/web-wallet-preview-mobile.png"
            alt="Web wallet mobile preview"
            class="web-wallet-mobile-preview"
          />
        </VStack>
      </VStack>
    </SettingCard>
  </section>
</template>

<style scoped>
.web-wallet-input {
  max-width: 24rem;
}
</style>
