<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  state: {
    type: String,
    default: '',
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
  return !props.percentage || props.percentage < 0 ? 0 : props.percentage
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
  height: 100%;
  color: var(--color-blue);
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
  background: var(--color-blue);
  border-radius: 999px;
  transition: width 0.4s;
}

progress::-moz-progress-bar {
  background-color: var(--color-blue);
  border-radius: 999px;
  transition: width 0.4s;
}

progress.success {
  color: var(--color-green);
}

progress.warn {
  color: var(--color-yellow);
}

progress.error {
  color: var(--color-orange);
}

progress.success::-webkit-progress-value,
.progress.success > span {
  background-color: var(--color-green);
}

progress.warn::-webkit-progress-value,
.progress.warn > span {
  background-color: var(--color-yellow);
}

progress.error::-webkit-progress-value,
.progress.error > span {
  background-color: var(--color-orange);
}

progress.success::-moz-progress-bar {
  background-color: var(--color-green);
}

progress.warn::-moz-progress-bar {
  background-color: var(--color-yellow);
}

progress.error::-moz-progress-bar {
  background-color: var(--color-orange);
}
</style>
