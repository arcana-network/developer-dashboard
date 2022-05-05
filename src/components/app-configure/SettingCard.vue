<script lang="ts" setup>
import VCard from '@/components/lib/VCard/VCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <VCard variant="elevated" class="settings-card">
    <VStack direction="column" gap="2rem" class="flex-grow">
      <h3 class="text-uppercase">
        <slot name="title" />
      </h3>
      <VSeperator class="settings-card-separator" />
      <slot name="description" class="body-1" />
      <slot />
    </VStack>
  </VCard>
</template>

<style scoped>
.settings-card {
  padding: 2rem 1.5rem;
}

.settings-card-separator {
  width: calc(100% + 3rem);
  margin: 0 -1.5rem;
}
</style>
