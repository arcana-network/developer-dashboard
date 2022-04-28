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
    type: [String, Number, Boolean],
    required: true,
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
