<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore } from '@/stores/apps.store'

const router = useRouter()
const appsStore = useAppsStore()

const apps = computed(() => appsStore.apps)
</script>

<template>
  <VStack direction="column" gap="2rem" class="configure-container">
    <VStack direction="column" gap="2rem" class="container">
      <VStack gap="2rem">
        <img
          src="@/assets/iconography/back.svg"
          class="cursor-pointer back-icon"
          alt="Go Back"
          @click.stop="router.back()"
        />
        <h1>MANAGE APPS</h1>
      </VStack>
      <div class="body-1 description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Lectus magna
        fringilla urna porttitor rhoncus dolor purus non.
      </div>
      <VStack gap="1.25rem">
        <VCard class="app-card">
          <VStack direction="column" gap="1.25rem" align="center">
            <router-link :to="{ name: 'CreateApp' }" class="create-app-link">
              <img src="@/assets/iconography/plus-circle-outline.svg" />
            </router-link>
            <span class="body-1 font-500">Create New App</span>
          </VStack>
        </VCard>
        <VCard v-for="app in apps" :key="`app-${app.id}`" class="app-card">{{
          app.name
        }}</VCard>
      </VStack>
    </VStack>
  </VStack>
</template>

<style scoped>
.back-icon {
  width: 2.25rem;
}

.description {
  font-size: 1.25rem;
  color: var(--text-grey);
}

.app-card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28rem;
  height: 31rem;
}

.create-app-link {
  line-height: 0;
  text-underline-offset: 0;
}
</style>
