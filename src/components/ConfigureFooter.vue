<template>
  <footer :class="{ show }">
    <div class="container flex flex-wrap">
      <v-button
        :label="cancelLabel || 'CANCEL'"
        :disabled="cancelDisabled"
        variant="secondary"
        @click.stop="onCancelClick"
        v-wave
      />
      <v-button
        :label="saveLabel || 'SAVE'"
        :disabled="saveDisabled"
        variant="primary"
        @click.stop="onSaveClick"
        v-wave
      />
    </div>
  </footer>
</template>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(29, 29, 29, 0.95);
  padding: 1.5em 0;
  display: flex;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s;
}
footer div {
  gap: 2em;
  justify-content: flex-end;
}
footer.show {
  opacity: 1;
  visibility: visible;
}
@media only screen and (max-width: 767px) {
  footer {
    padding-bottom: 0.5em;
  }
  footer div {
    gap: 0.5em;
    justify-content: center;
    flex-wrap: wrap-reverse;
  }
  .container {
    margin-bottom: 1vh;
  }
}
</style>

<script>
import VButton from "@/components/lib/VButton/VButton.vue";

export default {
  components: { VButton },
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    saveLabel: String,
    cancelLabel: String,
    saveDisabled: Boolean,
    cancelDisabled: Boolean,
  },
  name: "ConfigureFooter",
  setup(props, { emit }) {
    function onCancelClick() {
      emit("cancel");
    }

    function onSaveClick() {
      emit("save");
    }

    return { onCancelClick, onSaveClick };
  },
};
</script>
