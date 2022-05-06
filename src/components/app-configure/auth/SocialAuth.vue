<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'
import { useStore } from 'vuex'

import SettingCard from '@/components/app-configure/SettingCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'

const store = useStore()
const hasAggregateLogin: ComputedRef<boolean> = computed(
  () => store.getters.hasAggregateLogin
)
const isAppConfigured: ComputedRef<boolean> = computed(
  () => store.getters.isAppConfigured
)

function handleAggregateLoginChange(value: boolean) {
  store.commit('updateAggregateLogin', value)
}
</script>

<template>
  <section name="social-auth">
    <SettingCard>
      <template #title>Social Auth</template>
      <template #description>
        Increase adoption of your app by enabling this option. Arcana will take
        care of issuing public and prviate keys to each user through our
        Decentralised Key Generation (DKG) mechanism and keep them secure.
        <a>LEARN MORE</a>
      </template>
      <VStack gap="1rem">
        <span class="body-2">Aggregate Login</span>
        <VSwitch
          :model-value="hasAggregateLogin"
          :disabled="isAppConfigured"
          @update:model-value="handleAggregateLoginChange"
        />
      </VStack>
      <VStack>
        <h4>Social</h4>
        <VSeperator vertical />
        <h4>Keys</h4>
      </VStack>
    </SettingCard>
  </section>
</template>
