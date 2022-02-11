<template>
  <v-radio
    v-for="option in options"
    :key="option.value"
    :value="option.value"
    :label="option.label"
    :name="name"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>

<script>
import VRadio from "../VRadio/VRadio.vue";

export default {
  components: { VRadio },
  emits: ["update:modelValue"],
  props: {
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
  },
};
</script>
