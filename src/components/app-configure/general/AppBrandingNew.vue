<script setup>
import { ref } from 'vue'

import EmailerBranding from '@/components/app-configure/general/EmailerBranding.vue'
import WalletBranding from '@/components/app-configure/general/WalletBranding.vue'

const activeTab = ref('emailer')

function isActiveTab(tab) {
  return activeTab.value === tab
}
</script>

<template>
  <div>
    <h1>Branding</h1>
    <p>
      Customise the branding for emails sent during login. Choose your brand’s
      accent colors, fonts, and logo to maintain your brand identity during user
      logins.
    </p>
  </div>
  <div class="border-b-[1px] border-[#DCDCDC] flex flex-row gap-4">
    <button
      class="text-sm pb-1"
      :class="[
        isActiveTab('wallet')
          ? 'text-[#1D2A31] border-b-[1px] border-[#1D2A31] font-semibold'
          : 'text-[#989898] font-normal',
      ]"
      @click="activeTab = 'wallet'"
    >
      Wallet Branding
    </button>
    <button
      class="text-sm pb-1"
      :class="[
        isActiveTab('emailer')
          ? 'text-[#1D2A31] border-b-[1px] border-[#1D2A31] font-semibold'
          : 'text-[#989898] font-normal',
      ]"
      @click="activeTab = 'emailer'"
    >
      Emailer Branding
    </button>
  </div>
  <WalletBranding v-if="activeTab === 'wallet'" />
  <EmailerBranding v-if="activeTab === 'emailer'" />
</template>
