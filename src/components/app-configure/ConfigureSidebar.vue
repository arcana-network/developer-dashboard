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

const configureTabs = constants.configureTabs

const tabs = [
  {
    name: 'General',
    value: configureTabs.general,
  },
  {
    name: 'Auth',
    value: configureTabs.auth,
  },
  {
    name: 'Store',
    value: configureTabs.store,
  },
  {
    name: 'Access',
    value: configureTabs.access,
  },
  {
    name: 'Wallet',
    value: configureTabs.wallet,
  },
]
</script>

<template>
  <aside class="configure-sidebar">
    <VCard class="configure-sidebar-card">
      <VStack direction="column" gap="2rem" class="configure-tabs flex-grow">
        <VCardButton
          v-for="tab in tabs"
          :key="`configure-sidebar-tab-${tab.value}`"
          :active="currentTab === tab.value"
          @click.stop="emit('switch-tab', tab.value)"
          >{{ tab.name }}
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
