<script lang="ts" setup>
import AppBranding from '@/components/app-configure/general/AppBranding.vue'
import AppControls from '@/components/app-configure/general/AppControls.vue'
import AppName from '@/components/app-configure/general/AppName.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <AppName />
      <AppBranding />
      <AppControls />
    </VStack>
  </main>
</template>
