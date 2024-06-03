<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppBanner from '@/components/AppBanner.vue'

const router = useRouter()
const hideHeader = ref(false)

type HeaderProps = {
  container?: boolean
}

const props = defineProps<HeaderProps>()

function onLogoClick() {
  router.push('/')
}
</script>

<template>
  <section class="header-section" :class="hideHeader ? 'hide-header' : ''">
    <AppBanner />
    <header class="flex" :class="{ container: props.container }">
      <div class="logo" @click.stop="onLogoClick">
        <img src="@/assets/arcana-logo.svg" alt="Arcana Logo" />
      </div>
    </header>
  </section>
</template>

<style scoped>
.header-section {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  border-bottom: #d9d9d9 1px solid;
  transition: transform 0.4s;
}

header {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  visibility: visible;
  background: var(--primary-light);
  transition: transform 0.6s;
}

.hide-header {
  transform: translateY(-100%);
}

.logo {
  cursor: pointer;
  transition: opacity 0.3s;
}

.logo:hover {
  opacity: 0.6;
}
</style>
