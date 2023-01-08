<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import ArcanaLogo from '@/assets/iconography/arcana-dark-vertical.svg'
import arrowIcon from '@/assets/iconography/arrow.png'
import profileIcon from '@/assets/iconography/profile.png'
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore, type AppId } from '@/stores/apps.store'
import { useAuthStore } from '@/stores/auth.store'
import { CONFIGURE_TABS, type ConfigureTabType } from '@/utils/constants'

const authStore = useAuthStore()
const appsStore = useAppsStore()
const showConfigureSubmenu = ref(false)
const showAppsList = ref(false)
const router = useRouter()
const emit = defineEmits(['switch-tab'])

type ConfigureProps = {
  currentTab?: ConfigureTabType
}

withDefaults(defineProps<ConfigureProps>(), {
  currentTab: 'dashboard',
})

function onClickOfMenu(tab: string) {
  if (tab === 'configure') {
    showConfigureSubmenu.value = !showConfigureSubmenu.value
  } else {
    emit('switch-tab', tab)
  }
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
</script>

<template>
  <aside class="configure-sidebar">
    <VCard class="configure-sidebar-card">
      <button class="logo" @click.stop="onLogoClick">
        <img :src="ArcanaLogo" alt="Arcana Logo" />
      </button>
      <VStack direction="column" gap="1rem" class="configure-tabs flex-grow">
        <VStack class="apps-name__container">
          <button
            class="flex app-name__container"
            @click="showAppsList = !showAppsList"
          >
            <label>{{ appsStore.selectedApp?.name }}</label>
            <img
              v-if="appsStore.apps.length > 1"
              :src="arrowIcon"
              alt="arrow-icon"
              class="arrow-icon"
              :class="{
                'arrow-icon--active': showAppsList,
              }"
            />
          </button>
          <div
            v-if="appsStore.apps.length > 1 && showAppsList"
            class="apps-name__list-container"
          >
            <VCardButton
              v-for="app in appsStore.apps"
              :key="app.name"
              class="apps-name__list-item"
              :active="appsStore.selectedAppId === app.id"
              @click="onAppClick(app.id)"
            >
              {{ app.name }}
            </VCardButton>
          </div>
        </VStack>
        <VCardButton
          v-for="tab in CONFIGURE_TABS"
          :key="`configure-sidebar-tab-${tab.type}`"
          :class="{ strong: currentTab === tab.type }"
          class="sidebar__option"
          :active="currentTab === tab.type"
          @click.stop="onClickOfMenu(tab.type)"
        >
          <div class="sidebar__option-item">
            <img :src="tab.icon" alt="icon" class="sidebar__option-icon" />
            <span>{{ tab.label }}</span>
            <img
              v-if="tab.type === 'configure'"
              :src="arrowIcon"
              alt="arrow-icon"
              class="arrow-icon"
              :class="{
                'arrow-icon--active': showConfigureSubmenu,
              }"
            />
          </div>
          <div
            v-if="tab.subMenu && showConfigureSubmenu"
            class="sidebar__submenu"
            @click.stop=""
          >
            <VCardButton
              v-for="subTab in tab.subMenu"
              :key="subTab.label"
              class="sidebar__submenu-option"
              :active="currentTab === subTab.type"
              @click.stop="onClickOfMenu(subTab.type)"
            >
              <div class="sidebar__submenu-option-item">
                <img
                  :src="subTab.icon"
                  alt="icon"
                  class="sidebar__option-icon"
                />
                <span>{{ subTab.label }}</span>
              </div>
            </VCardButton>
          </div>
        </VCardButton>
        <VCardButton
          class="sidebar__option"
          style="flex-direction: row"
          :active="currentTab === 'profile'"
          @click.stop="onClickOfMenu('profile')"
        >
          <img :src="profileIcon" alt="icon" class="sidebar__option-icon" />
          <span>{{ authStore.name }}</span>
        </VCardButton>
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

.configure-sidebar {
  flex: 0 0 12rem;
  height: 100%;
}

.configure-sidebar-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  padding: 2.5rem 1.25rem;
  padding: 1rem;
  border-radius: 0;
}

.configure-tabs > * {
  width: 100%;
  text-align: left;
}

.configure-tabs {
  margin-top: 20px;
}

.sidebar__option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0.5rem 0;
}

.sidebar__option-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}

.sidebar__submenu {
  display: flex;
  flex-direction: column;
  align-items: baseline;
  justify-content: center;
  margin-top: 20px;
  margin-left: 20px;
}

.sidebar__submenu-option {
  padding: 0;
}

.sidebar__submenu-option:not(:last-child) {
  margin-bottom: 20px;
}

.sidebar__submenu-option-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}

.sidebar__option-icon {
  width: 18px;
  height: 18px;
  margin-right: 4px;
}

.arrow-icon {
  width: 18px;
  height: 18px;
  margin-left: 4px;
  transition: ease 0.5s;
}

.arrow-icon--active {
  transition: ease 0.5s;
  transform: rotate(180deg);
}

.strong {
  font-weight: 600 !important;
}

.apps-name__container {
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  border-bottom: 1px solid #8d8d8d;
}

.apps-name__list-container {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-left: 10px;
}

.apps-name__list-item {
  display: flex;
  justify-content: flex-start;
  padding: 0;
  margin-top: 10px;
  background-color: transparent;
  border: none;
  outline: none;
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
</style>
