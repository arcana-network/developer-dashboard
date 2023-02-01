<script setup lang="ts">
import { useRoute } from 'vue-router'

import DiscordIcon from '@/assets/discord-white.svg'
import DiscourseIcon from '@/assets/discourse-white.svg'
import TelegramIcon from '@/assets/telegram-white.svg'
import TwitterIcon from '@/assets/twitter-white.svg'
import VStack from '@/components/lib/VStack/VStack.vue'

type FooterProps = {
  showSocialIcons?: boolean
}

const props = defineProps<FooterProps>()

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
    href: 'https://discord.gg/6g7fQvEpdy',
    image: DiscordIcon,
    alt: 'Discord',
  },
]
</script>

<template>
  <footer>
    <VStack class="container" justify="space-between">
      <VStack
        v-if="props.showSocialIcons"
        gap="1.5rem"
        align="center"
        class="social-links"
      >
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
      <VStack gap="2.5rem" class="flex-grow" style="justify-content: end">
        <VStack gap="1rem" align="center" class="footer-links">
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
        </VStack>
        <!-- <VStack gap="0.5rem" align="center">
          <span class="body-2">Powered by</span>
          <a href="https://arcana.network" target="_blank">
            <img src="@/assets/arcana-logo.svg" class="arcana-logo" />
          </a>
        </VStack> -->
      </VStack>
    </VStack>
  </footer>
</template>

<style scoped>
footer {
  position: sticky;
  top: 100vh;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0.75rem 0;
  background: #1f1f1f;
  box-shadow: 0 9px 25px rgb(15 15 15 / 25%);
}

.container {
  margin-bottom: 0 !important;
}

.footer-link {
  text-decoration: none;
  vertical-align: middle;
}

.body-2 {
  font-size: 0.75rem;
  font-weight: 600;
}

.arcana-logo {
  height: 1.25rem;
  margin-top: -0.125rem;
  vertical-align: middle;
}

.social-links {
  flex: 1;
}

.social-icon {
  width: 1.25rem;
  vertical-align: middle;
}

@media only screen and (max-width: 767px) {
  .social-icon {
    width: 1rem;
  }

  .arcana-logo {
    height: 1rem;
  }
}
</style>
