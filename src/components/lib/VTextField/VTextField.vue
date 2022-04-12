<template>
  <div class="form-group" aria-label="Form group" :style="style">
    <label v-if="label" :style="[labelStyle]" :for="componentId">
      {{ label }}
    </label>
    <div class="text-field" :class="{ icon: !!icon }">
      <input
        :type="inputType"
        :id="componentId"
        :value="modelValue"
        @input="onInput"
        v-bind="attrs"
        :placeholder="placeholder"
        :class="{ strong }"
        :style="inputStyle"
      />
      <img
        v-if="icon"
        :src="icon"
        :class="{
          'icon-clickable': clickableIcon,
          height: '1.1em',
        }"
        @click.stop="onIconClicked"
      />
    </div>
    <span class="message" :class="messageType" v-if="!noMessage">
      {{ message || "Some message" }}
    </span>
  </div>
</template>

<style scoped>
div.form-group {
  display: inline-flex;
  flex-direction: column;
}
label {
  font-family: var(--font-body);
  color: var(--text-grey);
  font-weight: 400;
  font-size: 1.125em;
  line-height: 1.5em;
  margin: 10px 20px;
}
div.text-field {
  background: linear-gradient(141.48deg, #1a1a1a -4.56%, #151515 135.63%);
  box-shadow: inset -2px -2px 4px rgba(57, 57, 57, 0.44),
    inset 5px 5px 10px rgba(11, 11, 11, 0.5);
  border-radius: 10px;
  display: flex;
}
.message {
  font-family: var(--font-body);
  font-weight: 400;
  visibility: hidden;
  font-size: 0.94em;
  line-height: 1.5em;
  margin: 5px 20px;
}
.message.success {
  visibility: visible;
  color: #8fff00;
}
.message.error {
  visibility: visible;
  color: #ee193f;
}
.loading-state {
  color: transparent;
}
input {
  border: none;
  box-shadow: none;
  background: transparent;
  outline: none;
  --webkit-outline: none;
  color: var(--text-white);
  font-family: var(--font-body);
  font-size: 1.1em;
  line-height: 1.5em;
  margin: 15px 20px;
  padding: 0;
  width: 100%;
}
div.text-field.icon input {
  width: calc(100% - 80px);
}
input::placeholder,
input::-webkit-input-placeholder,
input::-moz-placeholder,
input:-ms-input-placeholder,
input:-moz-placeholder {
  color: var(--text-grey);
  font-family: var(--font-body);
  font-size: 1.1em;
  line-height: 1.5em;
  margin: 10px 20px;
}
input.strong {
  font-size: 1.4em;
  line-height: 1.65em;
  font-weight: 600;
  margin: 5px 20px;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px #181818 inset;
  -webkit-text-fill-color: var(--text-white);
}
img.icon-clickable {
  cursor: pointer;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>

<script>
import { reactive, ref, computed } from "vue";
import { getRandomId } from "../utils";

export default {
  name: "VTextField",
  inheritAttrs: false,
  props: {
    labelStyle: [String, Object],
    messageStyle: [String, Object],
    placeholderStyle: [String, Object],
    label: String,
    message: String,
    id: String,
    validation: Function,
    modelValue: [String, Number],
    type: String,
    messageType: String,
    placeholder: String,
    strong: Boolean,
    icon: [String, Object],
    clickableIcon: Boolean,
    inputStyle: [String, Object],
    noMessage: Boolean,
    style: [String, Object, Array],
  },
  setup(props, { emit, attrs }) {
    props = reactive(props);
    let componentId = props.id?.trim() ?? getRandomId();
    let iconClicked = ref(false);

    let inputType = computed(() => {
      return props.type?.trim().toLowerCase();
    });

    function validate(ev) {
      if ("validation" in props && "call" in props.validation) {
        props.validation.call(ev.target?.value);
      }
    }

    function onInput(ev) {
      emit("update:modelValue", ev.target?.value);
    }

    function onIconClicked(ev) {
      if (props.clickableIcon) {
        emit("icon-clicked", ev);
      }
    }

    return {
      componentId,
      validate,
      onInput,
      attrs,
      inputType,
      onIconClicked,
      iconClicked,
    };
  },
};
</script>