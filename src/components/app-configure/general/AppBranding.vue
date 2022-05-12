<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { availableThemes } from '@/utils/constants'

type Theme = {
  label: string
  value: string
}

const store = useStore()
const selectedTheme: ComputedRef<Theme | undefined> = computed(() => {
  return availableThemes.find(
    (theme) => theme.value === store.getters.selectedTheme
  )
})

function handleThemeChange(theme: Theme) {
  store.commit('updateSelectedTheme', theme.value)
}
</script>

<template>
  <section name="app-branding">
    <SettingCard class="app-branding-card">
      <template #title>Branding</template>
      <template #description
        >Lorem ipsum dolor sit amet, consectetuer adipiscing elit, Lorem ipsum
        dolor sit amet, consectetuer adipiscing elit.</template
      >
      <VStack direction="column" gap="2rem">
        <VStack direction="column" gap="0.75rem" align="start">
          <h4>Choose Theme</h4>
          <VDropdown
            :options="availableThemes"
            display-field="label"
            :model-value="selectedTheme"
            class="theme-dropdown"
            @update:model-value="handleThemeChange"
          />
        </VStack>
        <VStack direction="column" gap="1.5rem">
          <h3 class="text-uppercase">Upload Logo</h3>
          <h4 class="text-uppercase font-700">Light Mode</h4>
          <VStack gap="2.5rem" wrap>
            <VStack direction="column" gap="0.625rem">
              <label>Logo Mark</label>
              <VTextField type="file" no-message />
            </VStack>
            <VStack direction="column" gap="0.625rem">
              <label>Horizontal Logo</label>
              <VTextField type="file" no-message />
            </VStack>
          </VStack>
          <h4 class="text-uppercase font-700">Dark Mode</h4>
          <VStack gap="2.5rem" wrap>
            <VStack direction="column" gap="0.625rem">
              <label>Logo Mark</label>
              <VTextField type="file" no-message />
            </VStack>
            <VStack direction="column" gap="0.625rem">
              <label>Horizontal Logo</label>
              <VTextField type="file" no-message />
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </SettingCard>
  </section>
</template>

<style scoped>
label {
  color: var(--text-grey);
}

.theme-dropdown {
  min-width: 16rem;
}
</style>

<style>
.app-branding-card > * {
  z-index: 2 !important;
}
</style>
