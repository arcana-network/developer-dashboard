<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import VStack from '@/components/lib/VStack/VStack.vue'
import SocialLinks from '@/components/SocialLinks.vue'
import constants from '@/utils/constants'

const route = useRoute()

const canShowDocs = computed(() => {
  return route.name === 'Login'
})
</script>

<template>
  <footer>
    <VStack class="container">
      <VStack
        v-if="!route.meta.hasSidebar && !route.meta.hasLandingDescriptor"
        class="flex-grow"
      >
        <SocialLinks />
      </VStack>
      <VStack class="footer-container flex-grow">
        <VStack gap="1.25rem" align="center" class="footer-links">
          <a
            class="body-2 footer-text footer-link"
            href="https://github.com/arcana-network/license/blob/main/TERMS.md"
            target="_blank"
          >
            Terms of Use
          </a>
          <a
            class="body-2 footer-text footer-link tablet-remove"
            href="https://github.com/arcana-network/license/blob/main/PRIVACY.md"
            target="_blank"
          >
            Privacy Policy
          </a>
          <a
            v-if="canShowDocs"
            class="body-2 footer-text footer-link tablet-remove"
            :href="constants.DOCS_URL"
            target="_blank"
          >
            Docs
          </a>
        </VStack>
        <VStack gap="0.5rem" align="center">
          <span class="body-2 footer-logo-text">Powered by</span>
          <img src="@/assets/arcana-logo.svg" class="arcana-logo" />
        </VStack>
        <VStack
          gap="2rem"
          align="center"
          class="footer-links laptop-remove justify-end text-right"
        >
          <a
            class="body-2 footer-text footer-link"
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

<style scoped>
footer {
  padding: 2rem 0;
}

.footer-container {
  gap: 2.5rem;
  justify-content: flex-end;
}

.footer-link {
  text-decoration: none;
  vertical-align: middle;
}

.footer-text {
  font-size: 0.75rem;
  font-weight: 600;
}

.footer-logo-text {
  font-size: 1rem;
  font-weight: 600;
  vertical-align: middle;
}

.arcana-logo {
  height: 1.125rem;
  vertical-align: middle;
}

@media only screen and (max-width: 1023px) {
  footer {
    padding: 1rem 0;
    background: #1f1f1f;
    box-shadow: 0 9px 25px rgb(15 15 15 / 25%);
  }

  .footer-text,
  .footer-logo-text {
    font-size: 0.625rem;
  }

  .arcana-logo {
    height: 0.75rem;
  }

  .footer-container {
    gap: 1rem;
    justify-content: space-between;
  }
}
</style>
