<script setup lang="ts">
import DiscordIcon from '@/assets/discord-white.svg'
import DiscourseIcon from '@/assets/discourse-white.svg'
import TelegramIcon from '@/assets/telegram-white.svg'
import TwitterIcon from '@/assets/twitter-white.svg'
import VStack from '@/components/lib/VStack/VStack.vue'

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
  <VStack gap="1.5rem" align="center" class="social-links">
    <a
      v-for="socialLink in socialLinks"
      :key="socialLink.alt"
      :href="socialLink.href"
      target="_blank"
    >
      <img :src="socialLink.image" :alt="socialLink.alt" class="social-icon" />
    </a>
  </VStack>
</template>

<style scoped>
.social-icon {
  width: 1.25rem;
  vertical-align: middle;
}
</style>
