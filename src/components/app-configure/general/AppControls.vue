<script lang="ts" setup>
import { ref } from 'vue'

import AppDelete from '@/components/app-configure/general/AppDelete.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import { useAppId } from '@/use/getAppId'

const appId = useAppId()
const showDeletePopup = ref(false)
</script>

<template>
  <section name="configure-app-controls">
    <SettingCard>
      <template #title>Controls</template>
      <VButton
        label="DELETE"
        variant="secondary"
        class="self-start"
        @click.stop="showDeletePopup = true"
      />
    </SettingCard>
    <AppDelete
      v-if="showDeletePopup"
      :app-id="appId"
      @close="showDeletePopup = false"
    />
  </section>
</template>
