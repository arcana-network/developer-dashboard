<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VOverlay from '@/components/lib/VOverlay/VOverlay.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'

const store = useStore()
const appName = computed(() => store.getters.appName)

function onAppNameChange(appName: string) {
  store.commit('updateAppName', appName)
}
</script>

<template>
  <section name="configure-app-name">
    <VOverlay>
      <VCard class="modal-card">
        <VTextField
          :model-value="appName"
          class="app-name-input"
          no-message
          @update:model-value="onAppNameChange"
        />
        <VButton label="Create App" />
      </VCard>
    </VOverlay>
  </section>
</template>

<style scoped>
.app-name-input {
  max-width: 24rem;
}
</style>
