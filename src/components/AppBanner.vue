<script setup lang="ts">
import { ref } from 'vue'

import CloseIcon from '@/components/icons/CloseIcon.vue'

const canShowBanner = ref(false)

function onCloseBanner() {
  canShowBanner.value = false
}
</script>

<template>
  <div>
    <div v-if="canShowBanner" class="banner">
      <h5>
        Arcana Testnet undergoing scheduled maintenance. Logins on Testnet may
        be affected.
      </h5>
      <span class="banner-close" role="button" @click.stop="onCloseBanner">
        <CloseIcon color="var(--primary-light)" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.banner {
  position: relative;
  padding: 0.25em 1.5em;
  line-height: 1.5em;
  color: white;
  text-align: center;
  background: #fff;
}

.banner h4 {
  display: inline-block;
  font-size: 1.125rem;
  font-weight: 600;
  text-transform: uppercase;
}

.banner h5 {
  display: inline-block;
  margin-right: 2em;
  margin-left: 1em;
  font-size: 1rem;
  font-weight: 400;
}

.banner.hide {
  display: none;
}

.banner-close {
  position: absolute;
  right: 2em;
  margin-top: 2px;
  cursor: pointer;
}
</style>
