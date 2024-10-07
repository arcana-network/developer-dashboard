<script lang="ts" setup>
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import { regions, DOCS_URL } from '@/utils/constants'

const appsStore = useAppsStore()
const appId = useAppId()

const storageRegion = appsStore.app(appId).store.region
const selectedRegion = regions.find((region) => region.value === storageRegion)
</script>

<template>
  <section name="storage-region">
    <SettingCard class="storage-region-card z-20">
      <template #title>Storage Region</template>
      <template #description
        >Arcana Store uses physical storage nodes that are logically grouped by
        geography. This allows you to control the region or location where
        dApp's data assets reside, for compliance and regulatory purpose.
        <strong>Once a region has been selected it cannot be altered.</strong>
        <br />
        <a :href="`${DOCS_URL}/docs/storage_nodes`" target="_blank"
          >Learn More...</a
        ></template
      >
      <VStack direction="column" gap="0.75rem" align="start">
        <h4>Selected Region</h4>
        <VDropdown
          :options="regions"
          display-field="name"
          class="w-rem16"
          :model-value="selectedRegion"
          disabled
        />
      </VStack>
    </SettingCard>
  </section>
</template>
