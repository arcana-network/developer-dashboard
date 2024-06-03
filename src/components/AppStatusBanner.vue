<script setup lang="ts">
import { useRouter } from 'vue-router'

type StatusBannerProps = {
  status: 'overdue' | 'overlimit'
}

const props = defineProps<StatusBannerProps>()
const router = useRouter()

function getAction() {
  if (props.status === 'overdue') {
    return 'Pay now'
  }
  return 'Add payment details'
}

function handleCta() {
  if (props.status === 'overdue') {
    console.log('Handle Overdue')
  } else {
    return router.push({ name: 'Profile', hash: '#payment-details' })
  }
}
</script>

<template>
  <div class="status-banner">
    <span class="account-state">{{ props.status }}</span>
    <button class="account-state-cta" @click.stop="handleCta">
      {{ getAction() }}
    </button>
  </div>
</template>

<style scoped>
.status-banner {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 2.5rem;
  background-color: var(--color-red);
}

.account-state {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-white);
  text-transform: capitalize;
}

.account-state-cta {
  padding: 0.5rem 1rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--color-black);
  text-transform: uppercase;
  cursor: pointer;
  background-color: var(--color-white);
  border: none;
  border-radius: 0.5rem;
  box-shadow: none;
  transition: transform 0.3s;
  transform: scale(1);
  will-change: transform;
}

.account-state-cta:hover {
  transform: scale(1.1);
}
</style>
