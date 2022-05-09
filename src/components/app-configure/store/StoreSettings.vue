<script lang="ts" setup>
import AssetEncryption from '@/components/app-configure/store/AssetEncryption.vue'
import UserLimits from '@/components/app-configure/store/UserLimits.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <AssetEncryption />
      <UserLimits />
    </VStack>
  </main>
</template>
