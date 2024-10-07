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
  <section
    class="sticky top-0 z-overlay w-full border-b border-system-light_gray transition-transform duration-400"
    :class="hideHeader ? 'transform translate-y--100%' : ''"
  >
    <AppBanner />
    <header
      class="relative flex justify-between p-6 transition-transform visibility-visible duration-600 bg-white_solid-default"
      :class="{ container: props.container }"
    >
      <div
        class="cursor-pointer transition-opacity duration-300 hover:opacity-60"
        @click.stop="onLogoClick"
      >
        <img src="@/assets/arcana-logo.svg" alt="Arcana Logo" />
      </div>
    </header>
  </section>
</template>
