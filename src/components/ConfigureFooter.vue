<script lang="ts" setup>
import VButton from '@/components/lib/VButton/VButton.vue'

defineProps({
  show: {
    type: Boolean,
    default: true,
  },
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
})

const emit = defineEmits(['cancel', 'save'])

function onCancelClick() {
  emit('cancel')
}

function onSaveClick() {
  emit('save')
}
</script>

<template>
  <footer :class="{ show }">
    <div class="container flex flex-wrap">
      <v-button
        v-wave
        :label="cancelLabel"
        :disabled="cancelDisabled"
        variant="secondary"
        @click.stop="onCancelClick"
      />
      <v-button
        v-wave
        :label="saveLabel"
        :disabled="saveDisabled"
        variant="primary"
        @click.stop="onSaveClick"
      />
    </div>
  </footer>
</template>

<style scoped>
footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  padding: 1.5em 0;
  visibility: hidden;
  background: rgb(29 29 29 / 95%);
  opacity: 0;
  transition: opacity 0.3s;
}

footer div {
  gap: 2em;
  justify-content: flex-end;
}

footer.show {
  visibility: visible;
  opacity: 1;
}

@media only screen and (max-width: 767px) {
  footer {
    padding-bottom: 0.5em;
  }

  footer div {
    flex-wrap: wrap-reverse;
    gap: 0.5em;
    justify-content: center;
  }

  .container {
    margin-bottom: 1vh;
  }
}
</style>
