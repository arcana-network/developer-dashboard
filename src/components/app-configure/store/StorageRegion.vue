<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { regions, type Region, type StorageRegion } from '@/utils/constants'

const store = useStore()
const selectedRegion: ComputedRef<Region | undefined> = computed(() => {
  const storageRegion: StorageRegion = store.getters.storageRegion
  return regions.find((region) => region.value === storageRegion)
})

function handleChange(option: Region) {
  store.commit('updateStorageRegion', option.value)
}
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
        <h4>Choose Region</h4>
        <VDropdown
          :options="regions"
          display-field="name"
          class="region-dropdown"
          :model-value="selectedRegion"
          @update:model-value="handleChange"
        />
      </VStack>
    </SettingCard>
  </section>
</template>

<style scoped>
.region-dropdown {
  width: 16rem;
}
</style>

<style>
.storage-region-card > * {
  z-index: 2 !important;
}
</style>
