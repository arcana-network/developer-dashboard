<script lang="ts" setup>
import VRadio from '@/components/lib/VRadio/VRadio.vue'

defineProps({
  options: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  modelValue: {
    required: true,
    validator: (value: any) =>
      [undefined, null].includes(value) ||
      ['string', 'number', 'boolean'].includes(typeof value),
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <v-radio
    v-for="option in options"
    :key="option.value"
    :value="option.value"
    :label="option.label"
    :name="name"
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>
