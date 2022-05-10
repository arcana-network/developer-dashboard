<script lang="ts" setup>
import AssetEncryption from '@/components/app-configure/store/AssetEncryption.vue'
import StorageRegion from '@/components/app-configure/store/StorageRegion.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <AssetEncryption />
      <StorageRegion />
    </VStack>
  </main>
</template>
