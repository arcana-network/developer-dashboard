<script lang="ts" setup>
import ChainType from '@/components/app-configure/access/ChainType.vue'
import DidDelegate from '@/components/app-configure/access/DidDelegate.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <ChainType />
      <DidDelegate />
    </VStack>
  </main>
</template>
