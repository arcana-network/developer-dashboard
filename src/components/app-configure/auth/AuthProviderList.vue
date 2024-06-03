<script setup lang="ts">
import type { PropType } from 'vue'

import { useSocialAuthStore } from '@/stores/socialAuth.store'
import type { SocialAuthOption } from '@/utils/constants'

const props = defineProps({
  selectedProviderVerifier: {
    type: String,
    required: true,
  },
  providers: {
    type: Array as PropType<SocialAuthOption[]>,
    required: true,
  },
  authType: {
    type: String,
    required: true,
  },
})

const socialAuthStore = useSocialAuthStore()
const emits = defineEmits(['selectProvider'])

function isSelected(verifier: string) {
  return props.selectedProviderVerifier === verifier
}

function selectProvider(verifier: string) {
  emits('selectProvider', verifier)
}

function areRequiredFieldsFilled(verifier: string) {
  const authProvider =
    props.authType === 'social'
      ? socialAuthStore.socialAuthProviders
      : socialAuthStore.IAMAuthProviders
  const selectedAuthProvider = authProvider.find(
    (provider) => provider.verifier === verifier
  )
  const { hasClientSecret } = selectedAuthProvider
  const { clientId, clientSecret } =
    socialAuthStore.authCredentialsInput[props.authType][verifier]
  return hasClientSecret
    ? clientId.length > 0 && clientSecret.length > 0
    : clientId.length > 0
}
</script>

<template>
  <div
    class="w-32 h-full py-4 space-y-4 rounded-xl bg-liquidlight flex flex-col justify-around items-center"
  >
    <div
      v-for="provider in providers"
      :key="provider.name"
      class="flex flex-col items-center space-y-1 text-[#8D8D8DDE]"
    >
      <button
        class="border-2 bg-[#1F1F1F] cursor-pointer w-14 h-14 rounded-full flex items-center justify-center"
        :class="{
          'border-pink': isSelected(provider.verifier),
          grayscale: !areRequiredFieldsFilled(provider.verifier),
        }"
        @click.prevent="selectProvider(provider.verifier)"
      >
        <img
          :src="provider.icon"
          :alt="provider.verifier"
          class="transition-all ease-in-out"
        />
      </button>
      <span
        class="text-xs text-black"
        :class="{ 'text-pink': isSelected(provider.verifier) }"
        >{{ provider.name }}</span
      >
    </div>
  </div>
</template>
