<script lang="ts" setup>
import { ref, type Ref } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'

const store = useStore()
const hasAggregateLogin: Ref<boolean> = ref(store.getters.hasAggregateLogin)
const isAppConfigured: Ref<boolean> = ref(store.getters.isAppConfigured)

function handleSwitchStateChange(value: boolean) {
  hasAggregateLogin.value = value
  store.commit('updateAggregateLogin', value)
}
</script>

<template>
  <section name="configure-aggregate-login">
    <SettingCard>
      <template #title>Aggregate Login</template>
      <template #controls>
        <VSwitch
          :disabled="isAppConfigured"
          :model-value="hasAggregateLogin"
          @update:model-value="handleSwitchStateChange"
        />
      </template>
      <template #description
        >Allow your users to authenticate themselves by signing transactions
        using wallets. <a>LEARN MORE</a></template
      >
    </SettingCard>
  </section>
</template>
