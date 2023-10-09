<script lang="ts" setup>
import IAMProviders from '@/components/app-configure/auth/IAMProviders.vue'
import RedirectURI from '@/components/app-configure/auth/RedirectURI.vue'
import SocialAuth from '@/components/app-configure/auth/SocialAuth.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
</script>

<template>
  <main>
    <VStack direction="column" gap="2rem">
      <RedirectURI />
      <SocialAuth />
      <IAMProviders />
    </VStack>
  </main>
</template>
