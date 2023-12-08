<script setup lang="ts">
import type { PropType } from 'vue'

import VStack from '@/components/lib/VStack/VStack.vue'
import { useSocialAuthStore } from '@/stores/socialAuth.store'
import type { SocialAuthOption } from '@/utils/constants'

defineProps({
  authProvider: {
    type: Object as PropType<SocialAuthOption>,
    required: true,
  },
  authType: {
    type: String,
    required: true,
  },
})

const socialAuthStore = useSocialAuthStore()
const emits = defineEmits(['input1', 'input2'])

function handleInput1(event: Event) {
  emits('input1', event.target?.value)
}

function handleInput2(event: Event) {
  emits('input2', event.target?.value)
}
</script>

<template>
  <div
    class="flex space-x-12 max-[1080px]:flex-col max-[1080px]:space-x-0 max-[1080px]:space-y-4"
  >
    <VStack
      v-if="authProvider.verifier !== 'steam'"
      class="flex flex-1 flex-col space-y-2"
    >
      <div class="flex justify-between">
        <span class="text-xs">{{ authProvider.inputLabels.label1 }}</span>
        <a
          :href="authProvider.documentation1.link"
          target="_blank"
          class="no-underline text-white text-sm font-medium"
          >{{ authProvider.documentation1.label }}</a
        >
      </div>
      <input
        class="flex-1 text-white bg-[#313131] p-2 rounded-md outline-none"
        :placeholder="authProvider.inputLabels.label1"
        :value="
          socialAuthStore.authCredentialsInput[authType][authProvider.verifier]
            .clientId
        "
        @input="handleInput1"
      />
    </VStack>
    <VStack
      v-if="authProvider.hasClientSecret"
      class="flex flex-1 flex-col space-y-2"
    >
      <div class="flex justify-between">
        <span class="text-xs">{{ authProvider.inputLabels.label2 }}</span>
        <a
          :href="authProvider?.documentation2?.link"
          target="_blank"
          class="no-underline text-white text-sm font-medium"
          >{{ authProvider?.documentation2?.label }}</a
        >
      </div>
      <input
        class="flex-1 text-white bg-[#313131] p-2 rounded-md outline-none"
        :placeholder="authProvider.inputLabels.label2"
        :value="
          socialAuthStore.authCredentialsInput[authType][authProvider.verifier]
            .clientSecret
        "
        @input="handleInput2"
      />
    </VStack>
  </div>
</template>
