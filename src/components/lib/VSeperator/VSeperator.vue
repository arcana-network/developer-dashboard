<template>
  <hr v-if="!vertical" />
  <div v-else class="vr"></div>
</template>

<style scoped>
hr,
.vr {
  border: 1px solid #000000;
  box-shadow: 1px 1px 3px 4px rgba(45, 45, 45, 0.08),
    inset -10px -10px 20px rgba(0, 0, 0, 0.5), inset 10px 10px 15px #222222;
  filter: blur(1px);
  border-radius: 10px;
}
</style>

<script>
export default {
  props: {
    vertical: Boolean,
  },
  name: "VSeperator",
  setup() {},
};
</script>