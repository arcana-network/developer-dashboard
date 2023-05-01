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
  background: #161616;
  border-radius: 50%;
  box-shadow: inset 5px 5px 10px #121212;
  transform: translateX(0);
  appearance: none;
}

input[type='radio']::before {
  width: 16px;
  height: 16px;
  content: '';
  background: linear-gradient(180deg, #0085ff -4.5%, #29c8fa 100.1%);
  border-radius: 50%;
  transition: 120ms transform ease-in-out;
  transform: scale(0);
}

input[type='radio']:checked::before {
  transform: scale(1);
}

label {
  font-size: 1rem;
}
</style>
