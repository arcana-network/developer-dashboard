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
  <div class="footer flex flex-wrap flex-1">
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

<style scoped>
.footer {
  gap: 2rem;
  justify-content: flex-end;
}

@media only screen and (max-width: 767px) {
  .footer {
    flex-wrap: wrap-reverse;
    gap: 0.5rem;
    justify-content: center;
  }
}
</style>
