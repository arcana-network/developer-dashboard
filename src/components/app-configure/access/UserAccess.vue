<script lang="ts" setup>
import SettingCard from '@/components/app-configure/SettingCard.vue'
</script>

<template>
  <section name="user-access">
    <SettingCard>
      <template #title>User Access</template>
      <template #description
        >If you would like to be able to revoke your users' ability to access
        the assets they may have stored on the platform by using your app,
        please follow the instructions in the documentation here.
        <a>LEARN MORE</a></template
      >
    </SettingCard>
  </section>
</template>
