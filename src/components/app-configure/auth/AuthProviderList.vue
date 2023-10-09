<script setup lang="ts">
import type { PropType } from 'vue'

import type { SocialAuthOption } from '@/utils/constants'

const props = defineProps({
  selectedProvider: {
    type: String,
    required: true,
  },
  providers: {
    type: Array as PropType<SocialAuthOption[]>,
    required: true,
  },
})

const emits = defineEmits(['selectProvider'])

function isSelected(verifier: string) {
  return props.selectedProvider === verifier
}

function selectProvider(verifier: string) {
  emits('selectProvider', verifier)
}
</script>

<template>
  <div
    class="w-32 h-full rounded-xl bg-[#141414] flex flex-col justify-around items-center"
  >
    <div
      v-for="provider in providers"
      :key="provider.name"
      class="flex flex-col items-center space-y-1 text-[#8D8D8DDE]"
    >
      <button
        class="border-2 border-[#363636] bg-[#1F1F1F] cursor-pointer w-14 h-14 rounded-full flex items-center justify-center"
        :class="{
          'border-[#FFFFFF]': isSelected(provider.verifier),
        }"
        @click="selectProvider(provider.verifier)"
      >
        <img
          :src="provider.icon"
          :alt="provider.verifier"
          class="transition-all ease-in-out"
          :class="{
            'scale-125': isSelected(provider.verifier),
          }"
        />
      </button>
      <span
        class="text-xs text-[#8D8D8D]"
        :class="{ 'text-white': isSelected(provider.verifier) }"
        >{{ provider.name }}</span
      >
    </div>
  </div>
</template>
