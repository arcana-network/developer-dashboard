<template>
  <progress max="100" :value="value" :class="state">
    <div class="progress" :class="state">
      <span :style="{ width: value + '%' }"> Progress: {{ value }}% </span>
    </div>
  </progress>
</template>

<style scoped>
.progress {
  position: relative;
  display: block;
  min-width: 7.5em;
}
progress,
progress::-webkit-progress-bar,
.progress {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 1em;
  min-width: 7.5em;
  background: linear-gradient(143.36deg, #000000 115.05%, #c6c6c6 -4.7%);
  box-shadow: inset -2px -2px 4px rgba(80, 80, 80, 0.1),
    inset 5px 5px 5px rgba(0, 0, 0, 0.21),
    inset -10px -26px 33px -28px rgba(255, 255, 255, 0.1),
    inset -50px 49px 29px 22px rgba(28, 28, 28, 0.84);
  border-radius: 999px;
  color: #8fff00;
}
.progress > span {
  display: block;
  text-indent: -9999px;
}
progress::-webkit-progress-value,
.progress > span {
  background: #8fff00;
  border-radius: 999px;
  transition: width 0.4s;
}
progress::-moz-progress-bar {
  border-radius: 999px;
  background-color: #8fff00;
  transition: width 0.4s;
}
progress.success {
  color: #8fff00;
}
progress.warn {
  color: #ffc226;
}
progress.error {
  color: #ff6826;
}
progress.success::-webkit-progress-value,
.progress.success > span {
  background-color: #8fff00;
}
progress.warn::-webkit-progress-value,
.progress.warn > span {
  background-color: #ffc226;
}
progress.error::-webkit-progress-value,
.progress.error > span {
  background-color: #ff6826;
}
progress.success::-moz-progress-bar {
  background-color: #8fff00;
}
progress.warn::-moz-progress-bar {
  background-color: #ffc226;
}
progress.error::-moz-progress-bar {
  background-color: #ff6826;
}
</style>

<script>
import { computed } from "@vue/runtime-core";
export default {
  name: "VProgressBar",
  props: {
    state: String,
    percentage: Number,
  },
  setup(props) {
    const value = computed(() => {
      return !props.percentage || props.percentage < 2 ? 2 : props.percentage;
    });

    return {
      value,
    };
  },
};
</script>