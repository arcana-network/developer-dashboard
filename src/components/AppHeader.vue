<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import ArcanaLogo from '@/assets/iconography/arcana-dark-vertical.svg'
import AppNotifications from '@/components/AppNotifications.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import NotificationIcon from '@/components/icons/NotificationIcon.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import useArcanaAuth from '@/use/arcanaAuth'
import { useClickOutside } from '@/use/clickOutside'
import { HelpItems, ProfileItems } from '@/utils/constants'

const router = useRouter()
const canShowBanner = ref(false)
const hideHeader = ref(false)
const showHelpMenu = ref(false)
const showProfileMenu = ref(false)
const { logout } = useArcanaAuth()
const profile_menu = ref(null)
const help_menu = ref(null)
const showNotifications = ref(false)
const notification_menu = ref(null)

type HeaderProps = {
  container?: boolean
}

const props = defineProps<HeaderProps>()

let lastScrollTop = 0
const scrollDelta = 10

function onLogoClick() {
  router.push('/')
}

function onCloseBanner() {
  sessionStorage.setItem('hide-banner', 'true')
  canShowBanner.value = false
}

useClickOutside(profile_menu, () => {
  showProfileMenu.value = false
})

useClickOutside(help_menu, () => {
  showHelpMenu.value = false
})

useClickOutside(notification_menu, () => {
  showNotifications.value = false
})

onMounted(() => {
  canShowBanner.value = false
  document.querySelector('#app')?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  document.querySelector('#app')?.removeEventListener('scroll', handleScroll)
})

function handleScroll(ev: any) {
  const scrollTop = ev.target.scrollTop
  if (!hideHeader.value && scrollTop > lastScrollTop + scrollDelta) {
    hideHeader.value = true
  } else if (hideHeader.value && scrollTop < lastScrollTop) {
    hideHeader.value = false
  }
  if (ev.target.scrollHeight - scrollTop === ev.target.clientHeight) {
    hideHeader.value = false
  }
  lastScrollTop = ev.target.scrollTop
}

async function onLogout() {
  await logout()
  localStorage.clear()
  router.push({ name: 'Login' })
  window.location.reload()
}

function toggleHelpMenu() {
  showHelpMenu.value = !showHelpMenu.value
  showProfileMenu.value = false
}

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
  showHelpMenu.value = false
}

function toggleNotifications() {
  const value = !showNotifications.value
  showNotifications.value = value
}
</script>

<template>
  <section class="header-section" :class="hideHeader ? 'hide-header' : ''">
    <div v-if="canShowBanner" class="banner">
      <h4>Caution:</h4>
      <h5>
        Arcana Network SDKs and apps (Beta Release) are not recommended for
        production usage.
      </h5>
      <span class="banner-close" role="button" @click.stop="onCloseBanner">
        <CloseIcon color="#FFFFFF" />
      </span>
    </div>
    <header class="flex" :class="{ container: props.container }">
      <div class="logo" @click.stop="onLogoClick">
        <img :src="ArcanaLogo" alt="Arcana Logo" />
      </div>
      <VStack
        class="justify-end help-button__container"
        align="center"
        gap="1rem"
      >
        <div id="help_menu" ref="help_menu" class="position-relative flex">
          <button class="help-button" @click.stop="toggleHelpMenu">Help</button>
          <VCard v-if="showHelpMenu" class="help-menu-items position-absolute">
            <ul style="margin: 0">
              <li
                v-for="helpItem in HelpItems"
                :key="helpItem.label"
                class="cursor-pointer help-menu-item"
                @click.stop="showHelpMenu = false"
              >
                <a
                  :href="helpItem.link"
                  class="flex"
                  style="gap: 0.75rem"
                  target="_blank"
                >
                  <img :src="helpItem.icon" />
                  <span>{{ helpItem.label }} </span></a
                >
              </li>
            </ul>
          </VCard>
        </div>
        <div ref="notification_menu" class="notification-container flex">
          <NotificationIcon @click="toggleNotifications" />
          <AppNotifications
            v-if="showNotifications"
            @close="toggleNotifications"
          />
        </div>
        <div
          id="profile_menu"
          ref="profile_menu"
          class="position-relative flex"
        >
          <img
            src="@/assets/iconography/profile.svg"
            class="cursor-pointer"
            @click.stop="toggleProfileMenu"
          />
          <VCard
            v-if="showProfileMenu"
            class="help-menu-items position-absolute"
          >
            <ul style="margin: 0">
              <li
                v-for="profileItem in ProfileItems"
                :key="profileItem.label"
                class="cursor-pointer help-menu-item"
                @click.stop="showProfileMenu = false"
              >
                <RouterLink
                  :to="{
                    name: `App${profileItem.label}`,
                  }"
                  class="flex"
                  style="gap: 0.75rem"
                  ><img :src="profileItem.icon" />
                  <span>{{ profileItem.label }} </span></RouterLink
                >
              </li>
              <li
                class="cursor-pointer help-menu-item"
                style="margin-top: 1.5rem"
              >
                <VButton
                  label="LOGOUT"
                  variant="secondary"
                  @click.stop="onLogout"
                />
              </li>
            </ul>
          </VCard>
        </div>
      </VStack>
    </header>
  </section>
</template>

<style scoped>
.header-section {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  transition: transform 0.4s;
}

header {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  visibility: visible;
  background: #1f1f1f;
  transition: transform 0.6s;
}

.notification-container {
  position: relative;
}

.mobile-menu-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 1rem;
  background-color: transparent;
  border: none;
  outline: none;
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

.help-button {
  font-family: var(--font-body);
  color: var(--primary);
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
}

.help-menu-items {
  top: calc(100% + 0.75rem);
  right: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  padding-top: 1.25rem;
  box-shadow: -4px -5px 4px rgb(0 0 0 / 20%), 4px 5px 4px rgb(0 0 0 / 20%) !important;
}

.help-menu-items ul {
  padding: 0;
}

.help-menu-item {
  width: 100%;
  padding-inline: 1.25rem;
  padding-bottom: 1.25rem;
  font-family: var(--font-body);
  color: var(--text-white);
  white-space: nowrap;
  list-style: none;
}

.help-menu-items a {
  color: white;
  text-decoration: none;
}

.banner {
  position: relative;
  padding: 0.25em 1.5em;
  font-family: var(--font-body);
  line-height: 1.5em;
  color: white;
  text-align: center;
  background: linear-gradient(180deg, #0085ff -4.5%, #29c8fa 100.1%);
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

@media only screen and (max-width: 767px) {
  .notification-container {
    position: inherit;
  }
}
</style>
