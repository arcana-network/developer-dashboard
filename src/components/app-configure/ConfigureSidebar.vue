<script lang="ts" setup>
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { CONFIGURE_TABS, type ConfigureTab } from '@/utils/constants'

interface ConfigureProps {
  currentTab?: ConfigureTab
}

withDefaults(defineProps<ConfigureProps>(), {
  currentTab: 'general',
})

const emit = defineEmits(['switch-tab'])
</script>

<template>
  <aside class="configure-sidebar">
    <VCard class="configure-sidebar-card">
      <VStack direction="column" gap="2rem" class="configure-tabs flex-grow">
        <VCardButton
          v-for="tab in CONFIGURE_TABS"
          :key="`configure-sidebar-tab-${tab.type}`"
          :class="{ strong: currentTab === tab.type }"
          :active="currentTab === tab.type"
          @click.stop="emit('switch-tab', tab.type)"
          >{{ tab.label }}
        </VCardButton>
      </VStack>
    </VCard>
  </aside>
</template>

<style scoped>
.configure-sidebar {
  width: 12rem;
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

.strong {
  font-weight: 600 !important;
}
</style>
