<script lang="ts" setup>
import { computed, type ComputedRef } from 'vue'

import VCard from '@/components/lib/VCard/VCard.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'

interface SettingsProps {
  hasHeaderSwitch?: boolean
  switchState?: boolean
  isSwitchDisabled?: boolean
}

const props = withDefaults(defineProps<SettingsProps>(), {
  hasHeaderSwitch: false,
  switchState: false,
  isSwitchDisabled: false,
})

const emit = defineEmits(['switchStateChange'])

const headerSwitchState: ComputedRef<boolean> = computed(
  () => props.switchState
)

function handleSwitchStateChange(value: boolean) {
  emit('switchStateChange', value)
}
</script>

<template>
  <VCard variant="elevated" class="settings-card">
    <VStack direction="column" gap="2rem" class="flex-grow">
      <VStack justify="space-between">
        <h3 class="text-uppercase">
          <slot name="title" />
        </h3>
        <VSwitch
          v-if="props.hasHeaderSwitch"
          :disabled="isSwitchDisabled"
          :model-value="headerSwitchState"
          @update:model-value="handleSwitchStateChange"
        />
      </VStack>
      <VSeperator class="settings-card-separator" />
      <div class="body-1">
        <slot name="description" />
      </div>
      <slot />
    </VStack>
  </VCard>
</template>

<style scoped>
.settings-card {
  padding: 2rem 1.5rem;
}

.settings-card > * {
  z-index: 1;
}

.settings-card-separator {
  width: calc(100% + 3rem);
  margin: 0 -1.5rem;
}
</style>
