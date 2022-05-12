<script lang="ts" setup>
import StorageRegion from '@/components/app-configure/store/StorageRegion.vue'
import UserLimits from '@/components/app-configure/store/UserLimits.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <StorageRegion />
      <UserLimits />
    </VStack>
  </main>
</template>
