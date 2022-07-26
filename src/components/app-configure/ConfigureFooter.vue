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
  <footer>
    <div class="container flex flex-wrap">
      <v-button
        v-wave
        :label="cancelLabel"
        variant="secondary"
        @click.stop="emit('cancel')"
      />
      <v-button
        v-wave
        :label="saveLabel"
        variant="primary"
        @click.stop="emit('save')"
      />
    </div>
  </footer>
</template>

<style scoped>
footer {
  position: sticky;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  padding: 1.5rem 0;
  background: var(--dark-theme-bg);
}

footer div {
  gap: 2rem;
  justify-content: flex-end;
}

footer.show {
  visibility: visible;
  opacity: 1;
}

@media only screen and (max-width: 767px) {
  footer {
    padding-bottom: 0.5rem;
  }

  footer div {
    flex-wrap: wrap-reverse;
    gap: 0.5rem;
    justify-content: center;
  }

  .container {
    margin-bottom: 1vh;
  }
}
</style>
