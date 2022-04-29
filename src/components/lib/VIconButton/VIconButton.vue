<script lang="ts" setup>
import { useAttrs } from 'vue'

defineProps({
  icon: {
    type: String,
    default: '',
  },
})

const attrs = useAttrs()
</script>

<template>
  <button class="icon-button" v-bind="attrs">
    <img :src="icon" />
  </button>
</template>

<style scoped>
.icon-button {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 10px;
  box-shadow: unset;
}

.icon-button:disabled {
  cursor: not-allowed;
}

.icon-button:not(:disabled):hover {
  background: linear-gradient(
    44.81deg,
    #000 -147.88%,
    rgb(31 31 31 / 29%) 105.51%
  );
  box-shadow: 5px 5px 10px rgb(0 0 0 / 18%),
    10px 10px 17px -4px rgb(10 10 10 / 50%),
    -8px -8px 20px -2px rgb(255 255 255 / 6%),
    inset 44px 25px 7px 8px rgb(32 32 32 / 40%);
}

.icon-button:not(:disabled):active {
  background: linear-gradient(143.36deg, #000 -4.7%, #000 115.05%);
  box-shadow: inset -2px -2px 4px rgb(80 80 80 / 10%),
    inset 5px 5px 5px rgb(0 0 0 / 21%),
    inset -10px -26px 33px -28px rgb(255 255 255 / 10%),
    inset -50px 49px 29px 22px rgb(28 28 28 / 84%);
}
</style>
