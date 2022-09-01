<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  state: {
    type: String,
    default: 'success',
    validator: (value: string) =>
      ['', 'success', 'warn', 'error'].includes(value),
  },
  percentage: {
    type: Number,
    default: 0,
    required: true,
  },
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
  height: 100%;
  color: #8fff00;
  background: linear-gradient(141.48deg, #161616 -4.56%, #151515 135.63%);
  border-radius: 100px;
  box-shadow: inset 5px 5px 10px rgb(11 11 11 / 50%);
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
