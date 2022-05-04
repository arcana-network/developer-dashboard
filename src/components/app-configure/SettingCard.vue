<script lang="ts" setup>
import VCard from '@/components/lib/VCard/VCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <VCard variant="elevated" class="setting-card">
    <VStack direction="column">
      <h3 class="text-uppercase">
        <slot name="title" />
      </h3>
      <VSeperator />
      <slot name="description"></slot>
      <slot />
    </VStack>
  </VCard>
</template>

<style scoped>
.setting-card {
  padding: 2rem 1.5rem;
}
</style>
