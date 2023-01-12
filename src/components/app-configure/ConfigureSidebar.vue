<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import AppFallbackLogo from '@/assets/dapp-fallback.svg'
import DiscordIcon from '@/assets/discord-white.svg'
import DiscourseIcon from '@/assets/discourse-white.svg'
import ArcanaLogo from '@/assets/iconography/arcana-dark-vertical.svg'
import arrowIcon from '@/assets/iconography/arrow.png'
import TelegramIcon from '@/assets/telegram-white.svg'
import TwitterIcon from '@/assets/twitter-white.svg'
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore, type AppId } from '@/stores/apps.store'
import {
  CONFIGURE_TABS,
  type ConfigureTab,
  type ConfigureTabType,
} from '@/utils/constants'

const appsStore = useAppsStore()
const showConfigureSubmenu = ref(false)
const showAppsList = ref(false)
const router = useRouter()
const emit = defineEmits(['switch-tab'])

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

type ConfigureProps = {
  currentTab?: ConfigureTabType
}

const props = withDefaults(defineProps<ConfigureProps>(), {
  currentTab: 'Dashboard',
})

function onClickOfMenu(tab: ConfigureTab) {
  if (tab.subMenu) {
    showConfigureSubmenu.value = !showConfigureSubmenu.value
  } else {
    emit('switch-tab', tab.label)
  }
}

function getlogo(appId: AppId) {
  const app = appsStore.app(appId)
  return app.logos.dark.vertical || app.logos.light.vertical || AppFallbackLogo
}

function onLogoClick() {
  router.push('/')
}

function onAppClick(appId: AppId) {
  appsStore.setSelectedAppId(appId)
  emit('switch-tab', 'dashboard')
  router.push({ name: 'AppDetails', params: { appId } })
  showAppsList.value = false
}

function hasSubMenuSelected(tabLabel: string) {
  const selectedTab = CONFIGURE_TABS.find((tab) => tab.label === tabLabel)
  if (selectedTab && selectedTab.subMenu) {
    const subTab = selectedTab.subMenu.find(
      (el) => el.label === props.currentTab
    )
    if (subTab) return true
  }
  return false
}

onMounted(() => {
  const currentTab = props.currentTab
  showConfigureSubmenu.value =
    currentTab === 'Branding' ||
    currentTab === 'Social Auth' ||
    currentTab === 'Arcana Wallet'
})
</script>

<template>
  <aside class="configure-sidebar">
    <VCard class="configure-sidebar-card">
      <button class="logo" @click.stop="onLogoClick">
        <img :src="ArcanaLogo" alt="Arcana Logo" />
      </button>
      <VStack direction="column" gap="1rem" class="configure-tabs flex-grow">
        <VStack class="apps-name__container position-relative">
          <button
            class="flex app-name__container cursor-pointer"
            @click="showAppsList = !showAppsList"
          >
            <img
              :src="getlogo(appsStore.selectedAppId)"
              alt="app logo"
              class="app-logo"
            />
            <label class="selected-app text-ellipsis">{{
              appsStore.selectedApp?.name
            }}</label>
            <img
              :src="arrowIcon"
              alt="arrow-icon"
              class="arrow-icon"
              :class="{
                'arrow-icon--active': showAppsList,
              }"
            />
          </button>
          <VCard
            v-if="showAppsList"
            class="apps-name__list-container position-absolute"
          >
            <VCardButton
              v-for="app in appsStore.apps"
              :key="app.name"
              class="apps-name__list-item"
              :class="{ 'active-app': appsStore.selectedAppId === app.id }"
              @click="onAppClick(app.id)"
            >
              <img :src="getlogo(app.id)" alt="app logo" class="app-logo" />
              <span class="app-name text-ellipsis">{{ app.name }}</span>
            </VCardButton>
            <VSeperator class="app-full-bleed" />
            <VCardButton
              class="apps-name__list-item"
              @click="router.push({ name: 'ManageApps' })"
            >
              <img
                src="@/assets/iconography/manage.svg"
                alt="manage apps"
                class="app-icon"
              />
              <span class="app-name text-ellipsis">Manage Apps</span>
            </VCardButton>
          </VCard>
        </VStack>
        <VSeperator class="full-bleed" />
        <VCardButton
          v-for="tab in CONFIGURE_TABS"
          :key="`configure-sidebar-tab-${tab.type}`"
          :class="{
            'active-tab':
              props.currentTab === tab.label || hasSubMenuSelected(tab.label),
          }"
          class="sidebar__option"
          @click.stop="onClickOfMenu(tab)"
        >
          <div class="sidebar__option-item">
            <img :src="tab.icon" alt="icon" class="sidebar__option-icon" />
            <VStack gap="0.5rem" align="center">
              <span class="tab-label">{{ tab.label }}</span>
              <img
                v-if="tab.subMenu"
                :src="arrowIcon"
                alt="arrow-icon"
                class="arrow-icon"
                :class="{
                  'arrow-icon--active': showConfigureSubmenu,
                }"
              />
            </VStack>
          </div>
          <div
            v-if="tab.subMenu && showConfigureSubmenu"
            class="sidebar__submenu"
          >
            <VCardButton
              v-for="subTab in tab.subMenu"
              :key="subTab.label"
              class="sidebar__submenu-option"
              :class="{ 'submenu-active': props.currentTab === subTab.label }"
              @click.stop="onClickOfMenu(subTab)"
            >
              <div class="sidebar__submenu-option-item">
                <img
                  :src="subTab.icon"
                  alt="icon"
                  class="sidebar__submenu-option-icon"
                />
                <span class="submenu-tab-label">{{ subTab.label }}</span>
              </div>
            </VCardButton>
          </div>
        </VCardButton>
      </VStack>
      <VStack gap="1.5rem" align="center" class="social-links">
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
    </VCard>
  </aside>
</template>

<style scoped>
.logo {
  display: flex;
  justify-content: flex-start;
  padding: 0;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  transition: opacity 0.3s;
}

.app-logo {
  width: 2rem;
  height: 2rem;
}

.app-full-bleed {
  width: calc(100% + 2.5rem);
  margin-inline: -1.25rem;
}

.app-icon {
  width: 1.5rem;
  height: 1.5rem;
  padding: 0.25rem;
}

.configure-sidebar {
  width: 16rem;
  height: 100%;
}

.full-bleed {
  width: calc(100% + 4rem) !important;
  margin-inline: -2rem;
}

.configure-sidebar-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  padding: 2rem;
  padding-bottom: 0.75rem;
  overflow-y: auto;
  border-radius: 0;
}

.configure-tabs > * {
  width: 100%;
  text-align: left;
}

.configure-tabs {
  margin-top: 4rem;
  margin-bottom: 2rem;
}

.sidebar__option {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0.5rem 0 !important;
}

.sidebar__option-item {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: flex-start;
  justify-content: center;
}

.sidebar__submenu {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  justify-content: center;
  margin-top: 0.5rem;
  margin-left: 1.25rem;
}

.sidebar__submenu-option {
  padding: 0 !important;
}

.sidebar__submenu-option:not(:last-child) {
  margin-bottom: 1.5rem;
}

.sidebar__submenu-option-item {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: flex-start;
  justify-content: center;
}

.arrow-icon {
  width: 18px;
  height: 18px;
  margin-left: 4px;
  transition: ease 0.5s;
}

.arrow-icon--active {
  transition: ease 0.5s;
  transform: rotate(-180deg);
}

.strong {
  font-weight: 600 !important;
}

.apps-name__container {
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
}

.apps-name__list-container {
  top: 0;
  right: -1rem;
  left: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
  box-shadow: -4px -5px 4px rgb(0 0 0 / 20%), 4px 5px 4px rgb(0 0 0 / 20%) !important;
}

.apps-name__list-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-start;
  padding: 0 !important;
  background-color: transparent;
  border: none;
  outline: none;
}

.selected-app,
.tab-label,
.app-name,
.submenu-tab-label {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-white);
}

.selected-app {
  font-size: 1.5rem;
  font-weight: 500;
}

.active-app .app-name {
  color: var(--primary);
}

.apps-name__list-item .app-name:hover {
  color: var(--primary);
}

.app-name__container {
  display: flex;
  align-items: center;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
}

.app-name__container * + * {
  margin-left: 5px;
}

.apps-name__list-item * + * {
  margin-left: 5px;
}

.active-tab .tab-label {
  color: var(--primary);
}

.submenu-active .submenu-tab-label {
  color: var(--primary);
}

.active-tab .sidebar__option-icon {
  filter: invert(1) sepia(80%) hue-rotate(140deg) brightness(0.4) saturate(600);
}

.submenu-active .sidebar__submenu-option-icon {
  filter: invert(1) sepia(80%) hue-rotate(140deg) brightness(0.4) saturate(600);
}

.social-icon {
  width: 1.25rem;
  vertical-align: middle;
}

@media only screen and (max-width: 767px) {
  .social-icon {
    width: 1rem;
  }

  .configure-sidebar {
    width: 100%;
  }
}
</style>
