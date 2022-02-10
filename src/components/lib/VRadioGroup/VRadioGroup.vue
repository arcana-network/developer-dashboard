<template>
  <v-radio
    v-for="option in options"
    :key="option.value"
    :value="option.value"
    :label="option.label"
    :name="name"
    :selectedValue="selectedChain"
    @update:modelValue="$emit('update:modelValue', $event)"
  />
</template>

<script>
import VRadio from "../VRadio/VRadio.vue";

export default {
  components: { VRadio },
  props: {
    options: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    selectedChain: {
      type: String,
      required: true,
    },
  },
};
</script>
