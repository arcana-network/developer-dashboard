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
  color: var(--text-black);
  background: white;
  border-radius: 10px;
}

.card.elevated {
  /* box-shadow: inset 5px 5px 10px rgb(11 11 11 / 50%); */
}

.card.depressed {
  background: #efefef;
  border-radius: 10px;

  /* box-shadow: inset 5px 5px 10px rgb(11 11 11 / 50%); */
}

.card.popup {
  background-color: transparent;
}
</style>
