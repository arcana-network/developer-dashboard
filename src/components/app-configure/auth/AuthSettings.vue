<script lang="ts" setup>
import PasswordlessAuth from '@/components/app-configure/auth/PasswordlessAuth.vue'
import WalletAuth from '@/components/app-configure/auth/WalletAuth.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <PasswordlessAuth />
      <WalletAuth />
    </VStack>
  </main>
</template>
