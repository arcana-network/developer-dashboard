<script lang="ts" setup>
import AppControls from '@/components/app-configure/general/AppControls.vue'
import AppName from '@/components/app-configure/general/AppName.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <AppName />
      <AppControls />
    </VStack>
  </main>
</template>
