<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import ArcanaLogo from '@/assets/iconography/arcana-dark-vertical.svg'
import AppBanner from '@/components/AppBanner.vue'
import AppNotifications from '@/components/AppNotifications.vue'
import NotificationIcon from '@/components/icons/NotificationIcon.vue'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import useArcanaAuth from '@/use/arcanaAuth'
import { useClickOutside } from '@/use/clickOutside'
import { HelpItems, ProfileItems } from '@/utils/constants'

const router = useRouter()
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
  await router.push({ name: 'Login' })
  window.location.reload()
}

function toggleHelpMenu() {
  showHelpMenu.value = !showHelpMenu.value
  showProfileMenu.value = false
  showNotifications.value = false
}

function toggleProfileMenu() {
  showProfileMenu.value = !showProfileMenu.value
  showHelpMenu.value = false
  showNotifications.value = false
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  showHelpMenu.value = false
  showProfileMenu.value = false
}
</script>

<template>
  <section class="header-section" :class="hideHeader ? 'hide-header' : ''">
    <AppBanner />
    <header class="flex" :class="{ container: props.container }">
      <div class="logo" @click.stop="onLogoClick">
        <img :src="ArcanaLogo" alt="Arcana Logo" />
      </div>
      <VStack
        class="justify-end help-button__container"
        align="center"
        gap="1rem"
      >
        <div id="help_menu" ref="help_menu" class="relative flex">
          <button class="help-button" @click.stop="toggleHelpMenu">Help</button>
          <VCard v-if="showHelpMenu" class="help-menu-items absolute">
            <ul style="margin: 0">
              <li
                v-for="helpItem in HelpItems"
                :key="helpItem.label"
                class="cursor-pointer help-menu-item"
                @click.stop="showHelpMenu = false"
              >
                <a
                  :href="helpItem.link"
                  class="flex text-white no-underline"
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
        <div id="profile_menu" ref="profile_menu" class="relative flex">
          <img
            src="@/assets/iconography/profile.svg"
            class="cursor-pointer"
            @click.stop="toggleProfileMenu"
          />
          <VCard v-if="showProfileMenu" class="help-menu-items absolute">
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
                  class="flex text-white no-underline"
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
  width: 200px;
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
  color: var(--text-white);
  white-space: nowrap;
  list-style: none;
}

@media only screen and (max-width: 767px) {
  .notification-container {
    position: inherit;
  }
}
</style>
