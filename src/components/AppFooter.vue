<script setup lang="ts">
import DiscordIcon from '@/assets/discord-white.svg'
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
  <footer
    class="sticky top-[100vh] right-0 bottom-0 left-0 py-3 px-8 bg-[#1f1f1f] drop-shadow-[0_9px_25px_rgba(15,15,15,0.25)]"
  >
    <VStack justify="space-between">
      <VStack
        v-if="props.showSocialIcons"
        gap="1.5rem"
        align="center"
        class="flex-1"
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
            class="w-5 align-middle"
          />
        </a>
      </VStack>
      <VStack gap="2.5rem" class="flex-1" style="justify-content: end">
        <VStack gap="1rem" align="center" class="footer-links">
          <a
            class="text-xs font-semibold text-white no-underline"
            href="https://github.com/arcana-network/license/blob/main/TERMS.md"
            target="_blank"
          >
            Terms of Use
          </a>
          <a
            class="text-xs font-semibold text-white no-underline"
            href="https://github.com/arcana-network/license/blob/main/PRIVACY.md"
            target="_blank"
          >
            Privacy Policy
          </a>
        </VStack>
      </VStack>
    </VStack>
  </footer>
</template>
