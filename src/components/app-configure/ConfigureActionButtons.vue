<script lang="ts" setup>
import VButton from '@/components/lib/VButton/VButton.vue'

defineProps({
  saveLabel: {
    type: String,
    default: 'SAVE',
  },
  cancelLabel: {
    type: String,
    default: 'CANCEL',
  },
  saveDisabled: {
    type: Boolean,
    default: false,
  },
  cancelDisabled: {
    type: Boolean,
    default: false,
  },
  hideCancel: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['cancel', 'save'])
</script>

<template>
  <div
    class="flex gap-8 justify-end mt-4 flex-wrap flex-1 max-md:flex-wrap-reverse max-md:gap-2 max-md:justify-center"
  >
    <VButton
      v-if="!hideCancel"
      v-wave
      type="button"
      :label="cancelLabel"
      variant="secondary"
      :disabled="cancelDisabled"
      @click.stop="emit('cancel')"
    />
    <VButton
      v-wave
      type="submit"
      :label="saveLabel"
      variant="primary"
      :disabled="saveDisabled"
      @click.stop="emit('save')"
    />
  </div>
</template>
