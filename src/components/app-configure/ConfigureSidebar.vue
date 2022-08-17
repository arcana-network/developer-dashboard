<script lang="ts" setup>
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { CONFIGURE_TABS, type ConfigureTabType } from '@/utils/constants'

type ConfigureProps = {
  currentTab?: ConfigureTabType
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
          @click.stop="emit('switch-tab', tab)"
          >{{ tab.label }}
        </VCardButton>
      </VStack>
    </VCard>
  </aside>
</template>

<style scoped>
.configure-sidebar {
  flex: 0 0 12rem;
}

.configure-sidebar-card {
  flex-grow: 1;
  height: calc(100% - 5rem);
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
