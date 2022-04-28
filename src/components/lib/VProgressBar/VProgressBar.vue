<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  state: String,
  percentage: Number,
})

const value = computed(() => {
  return !props.percentage || props.percentage < 2 ? 2 : props.percentage
})
</script>

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
  min-width: 7.5em;
  height: 1em;
  color: #8fff00;
  background: linear-gradient(143.36deg, #000 115.05%, #c6c6c6 -4.7%);
  border-radius: 999px;
  box-shadow: inset -2px -2px 4px rgb(80 80 80 / 10%),
    inset 5px 5px 5px rgb(0 0 0 / 21%),
    inset -10px -26px 33px -28px rgb(255 255 255 / 10%),
    inset -50px 49px 29px 22px rgb(28 28 28 / 84%);
  appearance: none;
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
  background-color: #8fff00;
  border-radius: 999px;
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
