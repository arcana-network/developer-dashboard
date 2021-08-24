<template>
  <button class="icon-button" v-bind="args">
    <img :src="icon" />
  </button>
</template>

<style scoped>
.icon-button {
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: unset;
  border-radius: 10px;
  cursor: pointer;
}
.icon-button:hover {
  background: linear-gradient(
    44.81deg,
    #000000 -147.88%,
    rgba(31, 31, 31, 0.29) 105.51%
  );
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.18),
    10px 10px 17px -4px rgba(10, 10, 10, 0.5),
    -8px -8px 20px -2px rgba(255, 255, 255, 0.06),
    inset 44px 25px 7px 8px rgba(32, 32, 32, 0.4);
}
.icon-button:active {
  background: linear-gradient(143.36deg, #000000 -4.7%, #000000 115.05%);
  box-shadow: inset -2px -2px 4px rgba(80, 80, 80, 0.1),
    inset 5px 5px 5px rgba(0, 0, 0, 0.21),
    inset -10px -26px 33px -28px rgba(255, 255, 255, 0.1),
    inset -50px 49px 29px 22px rgba(28, 28, 28, 0.84);
}
.icon-button:disabled {
  cursor: not-allowed;
}
</style>

<script>
export default {
  props: { icon: [String, Object] },
  name: "VIconButton",
  setup(props, { args }) {
    return {
      args,
    };
  },
};
</script>