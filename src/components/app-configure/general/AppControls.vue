<script lang="ts" setup>
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
</script>

<template>
  <section name="configure-app-controls">
    <SettingCard>
      <template #title>Controls</template>
      <template #description
        >Lorem ipsum dolor sit amet, consectetuer adipiscing elit, Lorem ipsum
        dolor sit amet, consectetuer adipiscing elit.</template
      >
      <VButton label="DELETE" variant="secondary" class="delete-button" />
    </SettingCard>
  </section>
</template>

<style scoped>
.delete-button {
  align-self: flex-start;
}
</style>
