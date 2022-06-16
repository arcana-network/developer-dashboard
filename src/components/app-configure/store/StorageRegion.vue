<script lang="ts" setup>
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import { regions, type StorageRegion } from '@/utils/constants'

const store = useStore()
const storageRegion: StorageRegion = store.getters.storageRegion
const selectedRegion = regions.find((region) => region.value === storageRegion)
</script>

<template>
  <section name="storage-region">
    <SettingCard class="storage-region-card">
      <template #title>Storage Region</template>
      <template #description
        >Arcana logically groups storage nodes by geography so you can choose
        where your app's assets reside and conform to regulations.
        <a
          >Learn more about Arcana's Storage Nodes → Concepts: Storage Node</a
        ></template
      >
      <VStack direction="column" gap="0.75rem" align="start">
        <h4>Selected Region</h4>
        <VTextField
          disabled
          class="region-dropdown"
          :model-value="selectedRegion?.name"
        />
      </VStack>
    </SettingCard>
  </section>
</template>

<style>
.storage-region-card > * {
  z-index: 2 !important;
}
</style>
