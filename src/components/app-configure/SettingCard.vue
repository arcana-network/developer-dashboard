<script lang="ts" setup>
import { useSlots } from 'vue'

import VCard from '@/components/lib/VCard/VCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'

const slot = useSlots()
</script>

<template>
  <VCard variant="elevated" class="settings-card">
    <VStack direction="column" gap="2rem" class="flex-1">
      <VStack align="center" justify="space-between">
        <h2>
          <slot name="title" />
        </h2>
        <slot name="controls" />
      </VStack>
      <VSeperator class="settings-card-separator" />
      <div
        v-if="slot.description"
        class="text-lg font-normal settings-card-description"
      >
        <slot name="description" />
      </div>
      <slot />
    </VStack>
  </VCard>
</template>

<style scoped>
.settings-card {
  box-sizing: border-box;
  width: 100%;
  padding: 2rem 1.5rem;
}

.settings-card > * {
  z-index: 1;
}

.settings-card-separator {
  width: calc(100% + 3rem);
  margin: 0 -1.5rem;
}

.settings-card-description {
  color: var(--text-grey);
}
</style>
