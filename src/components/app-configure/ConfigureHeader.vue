<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VStack from '@/components/lib/VStack/VStack.vue'

const router = useRouter()
const networks = ['Testnet']
const selectedNetwork = ref('Testnet')
</script>

<template>
  <VStack direction="column" gap="2rem" class="container">
    <VStack justify="space-between" class="flex-grow">
      <VStack gap="2rem">
        <img
          src="@/assets/iconography/back.svg"
          class="cursor-pointer back-icon"
          alt="Go Back"
          @click.stop="router.back()"
        />
        <h1>CONFIGURE</h1>
      </VStack>
      <VDropdown v-model="selectedNetwork" :options="networks" />
    </VStack>
  </VStack>
</template>

<style scoped>
.back-icon {
  width: 3rem;
}

.container {
  margin: 2rem auto;
}
</style>
