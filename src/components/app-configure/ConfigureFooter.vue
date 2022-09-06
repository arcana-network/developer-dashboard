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
})

const emit = defineEmits(['cancel', 'save'])
</script>

<template>
  <div class="footer flex flex-wrap">
    <VButton
      v-wave
      :label="cancelLabel"
      variant="secondary"
      @click.stop="emit('cancel')"
    />
    <VButton
      v-wave
      type="submit"
      :label="saveLabel"
      variant="primary"
      @click.stop="emit('save')"
    />
  </div>
</template>

<style scoped>
.footer {
  display: flex;
  gap: 2rem;
  justify-content: flex-end;
  margin-top: 1.25rem;
}

@media only screen and (max-width: 767px) {
  .footer {
    flex-wrap: wrap-reverse;
    gap: 0.5rem;
    justify-content: center;
  }
}
</style>
