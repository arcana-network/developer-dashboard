<script lang="ts" setup>
import ChainType from '@/components/app-configure/access/ChainType.vue'
import UserAccess from '@/components/app-configure/access/UserAccess.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <UserAccess />
      <ChainType />
    </VStack>
  </main>
</template>
