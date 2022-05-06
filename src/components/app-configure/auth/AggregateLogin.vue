<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'

const store = useStore()
const hasAggregateLogin: ComputedRef<boolean> = computed(
  () => store.getters.hasAggregateLogin
)
const isAppConfigured: ComputedRef<boolean> = computed(
  () => store.getters.isAppConfigured
)

function handleSwitchStateChange(value: boolean) {
  store.commit('updateAggregateLogin', value)
}
</script>

<template>
  <section name="configure-aggregate-login">
    <SettingCard
      :has-header-switch="true"
      :switch-state="hasAggregateLogin"
      :is-switch-disabled="isAppConfigured"
      @switch-state-change="handleSwitchStateChange"
    >
      <template #title>Aggregate Login</template>
      <template #description
        >Allow your users to authenticate themselves by signing transactions
        using wallets. <a>LEARN MORE</a></template
      >
    </SettingCard>
  </section>
</template>
