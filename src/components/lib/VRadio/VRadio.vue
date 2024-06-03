<script lang="ts" setup>
import { useAttrs } from 'vue'

import VStack from '@/components/lib/VStack/VStack.vue'

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
  <VStack class="flex items-center justify-between" gap="0.5rem">
    <input
      :id="value"
      type="radio"
      :checked="modelValue === value"
      v-bind="attrs"
      @change="emit('update:modelValue', value)"
    />
    <label class="text-lg font-normal" :for="value">{{ label }}</label>
  </VStack>
</template>

<style scoped>
input[type='radio'] {
  display: grid;
  place-content: center;
  width: 20px;
  height: 20px;
  background: #fff;
  border: #000 1px solid;
  border-radius: 50%;
  transform: translateX(0);
  appearance: none;
}

input[type='radio']::before {
  width: 16px;
  height: 16px;
  content: '';
  background: #000;
  border: #fff 1px solid;
  border-radius: 50%;
  transition: 120ms transform ease-in-out;
  transform: scale(0);
}

input[type='radio']:checked::before {
  transform: scale(1);
}

label {
  font-size: 1rem;
  color: black;
}
</style>
