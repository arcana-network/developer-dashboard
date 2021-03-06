<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import DiscordIcon from '@/assets/discord-white.svg'
import DiscourseIcon from '@/assets/discourse-white.svg'
import TelegramIcon from '@/assets/telegram-white.svg'
import TwitterIcon from '@/assets/twitter-white.svg'
import VStack from '@/components/lib/VStack/VStack.vue'
import constants from '@/utils/constants'

const route = useRoute()

const canShowDocs = computed(() => {
  return route.name === 'Login'
})

const socialLinks = [
  {
    href: 'https://twitter.com/arcananetwork',
    image: TwitterIcon,
    alt: 'Twitter',
  },
  {
    href: 'https://t.me/ArcanaNetwork',
    image: TelegramIcon,
    alt: 'Telegram',
  },
  {
    href: 'https://discord.gg/w6ej4FtqYS',
    image: DiscordIcon,
    alt: 'Discord',
  },
  {
    href: 'https://forum.arcana.network/',
    image: DiscourseIcon,
    alt: 'Forum',
  },
]
</script>

<template>
  <footer>
    <VStack class="container">
      <VStack gap="2.5rem" align="center" class="footer-links">
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
      <VStack gap="2rem" align="center" class="social-links">
        <a
          v-for="socialLink in socialLinks"
          :key="socialLink.alt"
          :href="socialLink.href"
          target="_blank"
        >
          <img
            :src="socialLink.image"
            :alt="socialLink.alt"
            class="social-icon"
          />
        </a>
      </VStack>
    </VStack>
  </footer>
</template>

<style scoped>
footer {
  position: sticky;
  top: calc(100vh - 5rem);
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1.5rem 0;
  background: #1f1f1f;
  box-shadow: 0 9px 25px rgb(15 15 15 / 25%);
}

.footer-links {
  flex: 1;
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

.social-links {
  flex: 1;
  justify-content: end;
}

.social-icon {
  width: 2rem;
  vertical-align: middle;
}
</style>
