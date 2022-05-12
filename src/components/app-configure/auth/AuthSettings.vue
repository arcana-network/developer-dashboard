<script lang="ts" setup>
import AggregateLogin from '@/components/app-configure/auth/AggregateLogin.vue'
import PasswordlessAuth from '@/components/app-configure/auth/PasswordlessAuth.vue'
import SocialAuth from '@/components/app-configure/auth/SocialAuth.vue'
import WebWallet from '@/components/app-configure/auth/WebWallet.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <SocialAuth />
      <PasswordlessAuth />
      <AggregateLogin />
      <WebWallet />
    </VStack>
  </main>
</template>
