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
  color: var(--text-white);
  background: #262626;
  border-radius: 10px;
}

.card.elevated {
  box-shadow: 4px 5px 4px rgb(0 0 0 / 25%);
}

.card.depressed {
  background: linear-gradient(141.48deg, #161616 -4.56%, #151515 135.63%);
  border-radius: 10px;
  box-shadow: inset 5px 5px 10px rgb(11 11 11 / 50%),
    inset -50px 49px 29px 22px rgb(28 28 28 / 84%);
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
