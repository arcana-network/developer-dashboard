<script lang="ts" setup>
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { createApp } from '@/services/gateway.service'

const store = useStore()
const router = useRouter()
const appName: ComputedRef<string> = computed(() => store.getters.appName)
const hasAppNameError: Ref<boolean> = ref(false)

function handleAppNameChange(appName: string) {
  store.commit('updateAppName', appName)
}

async function handleCreateApp() {
  if (!appName.value?.trim()) {
    hasAppNameError.value = true
    return
  }
  store.commit('showLoader', 'Creating App...')
  hasAppNameError.value = false
  await createApp(appName.value)
  store.commit('hideLoader')
  router.push({ name: 'GeneralSettings' })
}
</script>

<template>
  <section name="create-app" class="create-app-section">
    <VCard variant="popup" class="create-app-modal-card">
      <h2 class="create-app-title">Create New App</h2>
      <VSeperator />
      <VStack direction="column" gap="1rem">
        <label class="app-name-label">Enter App Name</label>
        <VTextField
          :model-value="appName"
          class="app-name-input"
          :message-type="hasAppNameError ? 'error' : ''"
          message="App Name cannot be empty"
          @update:model-value="handleAppNameChange"
        />
      </VStack>
      <VButton
        label="CREATE"
        class="create-button"
        :disabled="!appName?.trim()"
        @click.stop="handleCreateApp"
      />
    </VCard>
  </section>
</template>

<style scoped>
.create-app-section {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgb(10 10 10 / 72%);
}

.create-app-modal-card {
  position: fixed;
  top: 50%;
  left: 50%;
  flex-direction: column;
  gap: 2rem;
  width: 72%;
  min-width: 200px;
  max-width: 560px;
  padding: 3rem 3rem 6rem;
  transform: translate(-50%, -50%);
}

.create-app-title {
  font-family: var(--font-body);
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
}

.app-name-label {
  font-family: var(--font-body);
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--text-grey);
}

.create-button {
  align-self: center;
  padding: 1rem 4rem;
}
</style>
