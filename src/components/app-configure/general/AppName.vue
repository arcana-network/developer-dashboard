<script lang="ts" setup>
import SettingCard from '@/components/app-configure/SettingCard.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
</script>

<template>
  <section name="configure-app-name">
    <SettingCard>
      <template #title>Enter App Name</template>
      <template #description
        >Lorem ipsum dolor sit amet, consectetuer adipiscing elit, Lorem ipsum
        dolor sit amet, consectetuer adipiscing elit.</template
      >
      <VTextField />
    </SettingCard>
  </section>
</template>
