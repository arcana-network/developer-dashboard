<script lang="ts" setup>
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { regions, type StorageRegion, DOCS_URL } from '@/utils/constants'

const store = useStore()
const storageRegion: StorageRegion = store.getters.storageRegion
const selectedRegion = regions.find((region) => region.value === storageRegion)
</script>

<template>
  <section name="storage-region">
    <SettingCard class="storage-region-card">
      <template #title>Storage Region</template>
      <template #description
        >Arcana Store uses physical storage nodes that are logically grouped by
        geography. This allows you to control the region or location where
        dApp's data assets reside, for compliance and regulatory purpose.
        <strong>Once a region has been selected it cannot be altered.</strong>
        <br />
        <a
          :href="`${DOCS_URL}/docs/storage_nodes`"
          target="_blank"
          class="learn-more"
          >Learn More...</a
        ></template
      >
      <VStack direction="column" gap="0.75rem" align="start">
        <h4>Selected Region</h4>
        <VDropdown
          :options="regions"
          display-field="name"
          class="region-dropdown"
          :model-value="selectedRegion"
          disabled
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
