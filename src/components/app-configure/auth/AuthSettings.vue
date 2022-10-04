<script lang="ts" setup>
import RedirectURI from '@/components/app-configure/auth/RedirectURI.vue'
import SocialAuth from '@/components/app-configure/auth/SocialAuth.vue'
import WebWallet from '@/components/app-configure/auth/WebWallet.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <RedirectURI />
      <SocialAuth />
      <WebWallet />
    </VStack>
  </main>
</template>
