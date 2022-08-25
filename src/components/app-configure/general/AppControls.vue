<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import AppDelete from '@/components/app-configure/general/AppDelete.vue'
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VButton from '@/components/lib/VButton/VButton.vue'

const route = useRoute()
const showDeletePopup = ref(false)
</script>

<template>
  <section name="configure-app-controls">
    <SettingCard>
      <template #title>Controls</template>
      <VButton
        label="DELETE"
        variant="secondary"
        class="delete-button"
        @click.stop="showDeletePopup = true"
      />
    </SettingCard>
    <AppDelete
      v-if="showDeletePopup"
      :app-id="Number(route.params.appId)"
      @close="showDeletePopup = false"
    />
  </section>
</template>

<style scoped>
.delete-button {
  align-self: flex-start;
}
</style>
