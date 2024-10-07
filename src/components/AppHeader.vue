<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import ArcanaLogo from '@/assets/arcana-logo.svg'
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
  <section
    class="sticky top-0 z-mid-overlayTop w-full border-b border-system-light_gray transition-transform duration-400"
    :class="hideHeader ? 'transform -translate-y-full' : ''"
  >
    <AppBanner />
    <header
      class="flex relative justify-between p-6 px-8 visible transition-transform duration-600 bg-white_solid-default"
      :class="{ container: props.container }"
    >
      <div
        class="cursor-pointer transition-opacity duration-300 hover:opacity-60"
        @click.stop="onLogoClick"
      >
        <img :src="ArcanaLogo" alt="Arcana Logo" />
      </div>
      <VStack
        class="justify-end help-button__container"
        align="center"
        gap="1rem"
      >
        <div id="help_menu" ref="help_menu" class="relative flex">
          <button
            class="cursor-pointer bg-transparent border-none outline-none text-black_solid-default hover:text-fairy_dust-default"
            @click.stop="toggleHelpMenu"
          >
            Help
          </button>
          <VCard
            v-if="showHelpMenu"
            class="absolute top-calc-full-add-rem75 right-0 z-mid-overlay flex flex-col items-center w-px200 p-0 pt-rem1.25 border border-system-light_gray text-black_solid-default"
          >
            <ul class="m-0 p-0 text-black_solid-default">
              <li
                v-for="helpItem in HelpItems"
                :key="helpItem.label"
                class="cursor-pointer w-full px-4 pb-4 whitespace-nowrap list-none text-black_solid-default"
                @click.stop="showHelpMenu = false"
              >
                <a
                  :href="helpItem.link"
                  class="flex text-black_solid-default no-underline font-normal gap-3 hover:custom-filter"
                  target="_blank"
                >
                  <img :src="helpItem.icon" />
                  <span>{{ helpItem.label }} </span></a
                >
              </li>
            </ul>
          </VCard>
        </div>
        <div ref="notification_menu" class="relative flex max-md:relative">
          <NotificationIcon
            class="notification-icon"
            @click="toggleNotifications"
          />
          <AppNotifications
            v-if="showNotifications"
            @close="toggleNotifications"
          />
        </div>
        <div id="profile_menu" ref="profile_menu" class="relative flex">
          <img
            src="@/assets/iconography/profile.svg"
            class="cursor-pointer hover:custom-filter"
            @click.stop="toggleProfileMenu"
          />
          <VCard
            v-if="showProfileMenu"
            class="absolute top-calc-full-add-rem75 right-0 z-mid-overlay flex flex-col items-center w-px200 p-0 pt-rem1.25 border border-system-light_gray text-black_solid-default"
          >
            <ul class="m-0 p-0 text-black_solid-default">
              <li
                v-for="profileItem in ProfileItems"
                :key="profileItem.label"
                class="cursor-pointer w-full px-4 pb-4 whitespace-nowrap list-none text-black_solid-default"
                @click.stop="showProfileMenu = false"
              >
                <RouterLink
                  :to="{
                    name: `App${profileItem.label}`,
                  }"
                  class="flex text-black_solid-default no-underline font-normal gap-3 hover:custom-filter"
                  ><img :src="profileItem.icon" />
                  <span>{{ profileItem.label }} </span></RouterLink
                >
              </li>
              <li
                class="cursor-pointer w-full px-4 pb-4 whitespace-nowrap list-none text-black_solid-default mt-2"
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
