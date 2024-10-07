<script lang="ts" setup>
import { useSlots } from 'vue'

import VCard from '@/components/lib/VCard/VCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'

const slot = useSlots()
</script>

<template>
  <VCard variant="elevated" class="box-border w-full pt-8 pb-8 px-6 py-6">
    <VStack direction="column" gap="1rem" class="flex-1 z-10">
      <VStack align="center" justify="space-between">
        <h2>
          <slot name="title" />
        </h2>
        <slot name="controls" />
      </VStack>
      <VSeperator class="w-calc-full-add-rem3 mx--rem1.5" />
      <div
        v-if="slot.description"
        class="text-md font-normal settings-card-description text-system-grey z-10"
      >
        <slot name="description" />
      </div>
      <slot />
    </VStack>
  </VCard>
</template>
