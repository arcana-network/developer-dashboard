<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import VStack from '@/components/lib/VStack/VStack.vue'
import constants from '@/utils/constants'

const route = useRoute()

const canShowDocs = computed(() => {
  return route.name === 'Login'
})
</script>

<template>
  <footer>
    <VStack justify="space-between" class="container">
      <VStack gap="2.5rem" align="center">
        <a
          class="body-2 footer-link"
          href="https://github.com/arcana-network/license/blob/main/TERMS.md"
          target="_blank"
        >
          Terms of Use
        </a>
        <a
          class="body-2 footer-link"
          href="https://github.com/arcana-network/license/blob/main/PRIVACY.md"
          target="_blank"
        >
          Privacy Policy
        </a>
        <a
          v-if="canShowDocs"
          class="body-2 footer-link"
          :href="constants.DOCS_URL"
          target="_blank"
        >
          Docs
        </a>
      </VStack>
      <VStack gap="0.5rem" align="center">
        <span class="body-2">Powered by</span>
        <img src="@/assets/arcana-logo.svg" class="arcana-logo" />
      </VStack>
      <VStack gap="2rem" align="center">
        <a href="https://twitter.com/arcananetwork" target="_blank">
          <img src="@/assets/twitter-white.svg" class="social-icon" />
        </a>
        <a href="https://t.me/ArcanaNetwork" target="_blank">
          <img src="@/assets/telegram-white.svg" class="social-icon" />
        </a>
        <a href="https://discord.gg/w6ej4FtqYS" target="_blank">
          <img src="@/assets/discord-white.svg" class="social-icon" />
        </a>
        <a href="https://forum.arcana.network/" target="_blank">
          <img src="@/assets/discourse-white.svg" class="social-icon" />
        </a>
      </VStack>
    </VStack>
  </footer>
</template>

<style scoped>
footer {
  position: sticky;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1.5rem 0;
  background: #1f1f1f;
  box-shadow: 0 9px 25px rgb(15 15 15 / 25%);
}

.footer-link {
  text-decoration: none;
  vertical-align: middle;
}

.body-2 {
  font-size: 1.125rem;
  font-weight: 600;
}

.arcana-logo {
  height: 1.5rem;
  margin-top: -0.125rem;
  vertical-align: middle;
}

.social-icon {
  width: 2rem;
  vertical-align: middle;
}
</style>
