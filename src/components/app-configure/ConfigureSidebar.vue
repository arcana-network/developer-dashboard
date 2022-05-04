<script lang="ts" setup>
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import constants from '@/utils/constants'

defineProps({
  currentTab: {
    type: String,
    validator: (value: string) =>
      ['general', 'auth', 'store', 'access', 'wallet'].includes(value),
    default: 'general',
  },
})

const emit = defineEmits(['switch-tab'])

const tabs = constants.configureTabs
</script>

<template>
  <aside class="configure-sidebar">
    <VCard class="configure-sidebar-card">
      <VStack direction="column" gap="2rem" class="configure-tabs flex-grow">
        <VCardButton
          :active="currentTab === tabs.general"
          @click.stop="emit('switch-tab', tabs.general)"
          >General
        </VCardButton>
        <VCardButton
          :active="currentTab === tabs.auth"
          @click.stop="emit('switch-tab', tabs.auth)"
          >Auth</VCardButton
        >
        <VCardButton
          :active="currentTab === tabs.store"
          @click.stop="emit('switch-tab', tabs.store)"
          >Store
        </VCardButton>
        <VCardButton
          :active="currentTab === tabs.access"
          @click.stop="emit('switch-tab', tabs.access)"
          >Access
        </VCardButton>
        <VCardButton
          :active="currentTab === tabs.wallet"
          @click.stop="emit('switch-tab', tabs.wallet)"
          >Wallet
        </VCardButton>
      </VStack>
    </VCard>
  </aside>
</template>

<style>
.configure-sidebar {
  max-width: 12rem;
  height: 100vh;
}

.configure-sidebar-card {
  flex-grow: 1;
  padding: 2.5rem 1.25rem;
}

.configure-tabs > * {
  width: 100%;
  text-align: left;
}
</style>
