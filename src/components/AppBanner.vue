<script setup lang="ts">
import { ref } from 'vue'

import CloseIcon from '@/components/icons/CloseIcon.vue'

const canShowBanner = ref(true)

function onCloseBanner() {
  canShowBanner.value = false
}
</script>

<template>
  <div>
    <div v-if="canShowBanner" class="banner">
      <h5>
        Big News: Arcana has been acquired by Avail
        <a
          href="https://blog.availproject.org/avail-acquires-arcana-to-accelerate-multichain-scalability/"
          target="_blank"
          >Read More</a
        >.
      </h5>
      <button class="banner-close" role="button" @click.stop="onCloseBanner">
        <CloseIcon color="var(--primary-light)" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em 1.5em;
  line-height: 1.5em;
  color: white;
  text-align: center;
  background: #0085ff;
}

.banner h4 {
  display: inline-block;
  font-size: 1.125rem;
  font-weight: 600;
}

.banner h5 {
  display: inline-block;
  margin-right: 2em;
  margin-left: 1em;
  font-size: 1rem;
  font-weight: 400;
}

.banner a {
  font-weight: 500;
  color: white;
  text-decoration: underline;
}

.banner.hide {
  display: none;
}

.banner-close {
  position: absolute;
  right: 2em;
  cursor: pointer;
}
</style>
