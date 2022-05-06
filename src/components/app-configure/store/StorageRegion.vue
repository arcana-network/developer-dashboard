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
    <SettingCard>
      <template #title>Storage Region</template>
      <template #description
        >Please specify where your data should be hosted by selecting from the
        geographical regions provided below. <a>LEARN MORE</a></template
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
