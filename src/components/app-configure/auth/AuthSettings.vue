<script lang="ts" setup>
import IAMProviders from '@/components/app-configure/auth/IAMProviders.vue'
import RedirectURI from '@/components/app-configure/auth/RedirectURI.vue'
import SocialAuthProvider from '@/components/app-configure/auth/SocialAuthProvider.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <RedirectURI />
      <SocialAuthProvider />
      <IAMProviders />
    </VStack>
  </main>
</template>
