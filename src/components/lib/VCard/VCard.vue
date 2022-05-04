<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'elevated',
    validator: (value: string) =>
      ['elevated', 'depressed', 'popup'].includes(value),
  },
  cardClass: {
    type: [String, Object],
    default: '',
  },
  cardStyle: {
    type: [String, Object],
    default: '',
  },
})

const classes = computed(() => {
  const defaultValues = {
    depressed: false,
    elevated: false,
    popup: false,
  }

  if (props.variant?.trim()) {
    const variant = props.variant.trim().toLowerCase()
    if (variant in defaultValues) {
      defaultValues[variant] = true
    } else {
      defaultValues.elevated = true
    }
  }

  return defaultValues
})
</script>

<template>
  <section
    :style="[cardStyle]"
    :class="['card', classes, cardClass]"
    aria-label="card"
    role="group"
  >
    <slot></slot>
  </section>
</template>

<style scoped>
.card {
  display: flex;
  background: radial-gradient(
    134.5% 939.99% at -23.59% -12.9%,
    #262626 0%,
    rgb(26 26 26 / 86.3%) 31.41%,
    rgb(32 32 32 / 49%) 100%
  );
  border-radius: 20px;
}

.card.elevated {
  box-shadow: 4px 5px 4px rgb(0 0 0 / 25%);
}

.card.depressed {
  box-shadow: inset -2px -2px 4px rgb(57 57 57 / 44%),
    inset 5px 5px 10px rgb(11 11 11 / 50%);
}

.card.popup {
  background: radial-gradient(
    134.5% 939.99% at -23.59% -12.9%,
    #151515 0%,
    rgb(27 27 27 / 100%) 31.41%,
    rgb(32 32 32 / 100%) 100%
  );
  box-shadow: 4px 5px 4px rgb(0 0 0 / 25%);
}
</style>
