<script lang="ts" setup>
import SocialAuth from '@/components/app-configure/auth/SocialAuth.vue'
import WalletAuth from '@/components/app-configure/auth/WalletAuth.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <SocialAuth />
      <WalletAuth />
    </VStack>
  </main>
</template>
