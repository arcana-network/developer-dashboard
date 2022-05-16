<script lang="ts" setup>
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import copyToClipboard from '@/utils/copyToClipboard'

const store = useStore()
</script>

<template>
  <section name="redirect-uri">
    <SettingCard>
      <template #title>Redirect URI</template>
      <template #controls>
        <VCard variant="elevated" class="redirect-uri-card">
          <VStack align="center" justify="space-between" class="flex-grow">
            <span class="body-1">{{ store.getters.redirectUri }}</span>
            <img
              src="@/assets/iconography/copy.svg"
              class="cursor-pointer copy-icon"
              @click.stop="copyToClipboard(store.getters.redirectUri)"
            />
          </VStack>
        </VCard>
      </template>
      <template #description
        >Allow your users to authenticate themselves by signing transactions
        using wallets. <a>LEARN MORE</a></template
      >
    </SettingCard>
  </section>
</template>

<style scoped>
.redirect-uri-card {
  width: 20rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
}
</style>
