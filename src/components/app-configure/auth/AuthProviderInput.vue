<script setup lang="ts">
import type { PropType } from 'vue'

import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import type { SocialAuthOption } from '@/utils/constants'

defineProps({
  provider: {
    type: Object as PropType<SocialAuthOption>,
    required: true,
  },
})

const emits = defineEmits(['input1', 'input2'])

function handleInput1(value: string) {
  emits('input1', value)
}

function handleInput2(value: string) {
  emits('input2', value)
}
</script>

<template>
  <div
    class="flex space-x-12 max-[1080px]:flex-col max-[1080px]:space-x-0 max-[1080px]:space-y-4"
  >
    <VStack class="flex flex-1 flex-col space-y-2">
      <div class="flex justify-between">
        <span class="text-xs">{{ provider.inputLabels.label1 }}</span>
        <a
          :href="provider.documentation1.link"
          target="_blank"
          class="no-underline text-white text-sm font-medium"
          >{{ provider.documentation1.label }}</a
        >
      </div>
      <VTextField
        class="flex-1"
        no-message
        :placeholder="provider.inputLabels.label1"
        @update:model-value="handleInput1"
      />
    </VStack>
    <VStack
      v-if="provider.hasClientSecret"
      class="flex flex-1 flex-col space-y-2"
    >
      <div class="flex justify-between">
        <span class="text-xs">{{ provider.inputLabels.label1 }}</span>
        <a
          :href="provider?.documentation2?.link"
          target="_blank"
          class="no-underline text-white text-sm font-medium"
          >{{ provider?.documentation2?.label }}</a
        >
      </div>
      <VTextField
        class="flex-1"
        no-message
        :placeholder="provider.inputLabels.label2"
        @update:model-value="handleInput2"
      />
    </VStack>
  </div>
</template>
