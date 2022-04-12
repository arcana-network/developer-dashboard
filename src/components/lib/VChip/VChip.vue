<template>
  <div class="chip flex">
    <div class="content">
      <slot />
    </div>
    <img
      :src="CancelIcon"
      v-if="cancellable"
      class="cancel-icon"
      @click.stop="onCancel"
    />
  </div>
</template>

<style scoped>
.chip {
  position: relative;
  background: radial-gradient(
    134.5% 939.99% at -23.59% -12.9%,
    #262626 0%,
    rgba(26, 26, 26, 0.86293) 31.41%,
    rgba(32, 32, 32, 0.49) 100%
  );
  box-shadow: 4px 5px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 1em;
  width: 240px;
}

.content {
  width: calc(240px - 2em);
  text-overflow: ellipsis;
  overflow-x: hidden;
  white-space: nowrap;
  color: white;
}

.cancel-icon {
  cursor: pointer;
  position: absolute;
  right: 1em;
  top: 1.2em;
  margin-left: 2em;
}
</style>

<script>
import CancelIcon from "@/assets/iconography/close.svg";

export default {
  name: "VChip",
  props: {
    cancellable: Boolean,
  },
  setup(props, { emit }) {
    function onCancel() {
      emit("cancel");
    }

    return {
      CancelIcon,
      onCancel,
    };
  },
};
</script>