<script lang="ts" setup>
import { useAttrs } from 'vue'

defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    required: true,
    validator: (value: any) =>
      [undefined, null].includes(value) ||
      ['string', 'number', 'boolean'].includes(typeof value),
  },
  value: {
    required: true,
    validator: (value: any) =>
      [undefined, null].includes(value) ||
      ['string', 'number', 'boolean'].includes(typeof value),
  },
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
</script>

<template>
  <div class="flex flex-center justify-space-between">
    <label class="body-1" :for="value">{{ label }}</label>
    <input
      :id="value"
      type="radio"
      :checked="modelValue === value"
      v-bind="attrs"
      @change="emit('update:modelValue', value)"
    />
  </div>
</template>

<style scoped>
input[type='radio'] {
  display: grid;
  place-content: center;
  width: 20px;
  height: 20px;
  background: linear-gradient(143.36deg, #c6c6c6 -4.7%, #000 115.05%);
  border-radius: 50%;
  box-shadow: inset -2px -2px 4px rgb(80 80 80 / 10%),
    inset 5px 5px 5px rgb(0 0 0 / 21%),
    inset -10px -26px 33px -28px rgb(255 255 255 / 10%),
    inset -50px 49px 29px 22px rgb(28 28 28 / 84%);
  transform: translateX(0);
  appearance: none;
}

input[type='radio']::before {
  width: 16px;
  height: 16px;
  content: '';
  background: linear-gradient(220.53deg, #9bf763 0%, #26ab5b 76.95%);
  border-radius: 50%;
  transition: 120ms transform ease-in-out;
  transform: scale(0);
}

input[type='radio']:checked::before {
  transform: scale(1);
}
</style>
