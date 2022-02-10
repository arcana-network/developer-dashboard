<template>
  <div class="flex flex-center justify-space-between">
    <label class="body-1">{{ label }}</label>
    <input
      type="radio"
      :checked="selectedValue === value"
      v-bind="$attrs"
      @change="$emit('update:modelValue', value)"
    />
  </div>
</template>

<style scoped>
input[type="radio"] {
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(143.36deg, #c6c6c6 -4.7%, #000000 115.05%);
  box-shadow: inset -2px -2px 4px rgba(80, 80, 80, 0.1),
    inset 5px 5px 5px rgba(0, 0, 0, 0.21),
    inset -10px -26px 33px -28px rgba(255, 255, 255, 0.1),
    inset -50px 49px 29px 22px rgba(28, 28, 28, 0.84);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  transform: translateX(0);
  display: grid;
  place-content: center;
}

input[type="radio"]::before {
  content: "";
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  background: linear-gradient(220.53deg, #9bf763 0%, #26ab5b 76.95%);
}

input[type="radio"]:checked::before {
  transform: scale(1);
}
</style>

<script>
export default {
  name: "VRadio",
  props: {
    label: {
      type: String,
      default: "",
    },
    selectedValue: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      required: true,
    },
  },
};
</script>
