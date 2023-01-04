<script lang="ts" setup>
import { ref } from 'vue'

import ArcanaLogo from '@/assets/iconography/arcana-dark-vertical.svg'
import arrowIcon from '@/assets/iconography/arrow.png'
import profileIcon from '@/assets/iconography/profile.png'
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAuthStore } from '@/stores/auth.store'
import { CONFIGURE_TABS, type ConfigureTabType } from '@/utils/constants'

const authStore = useAuthStore()
const showConfigureSubmenu = ref(false)
const emit = defineEmits(['switch-tab'])

function onClickOfMenu(tab: string) {
  // emit('switch-tab', tab)
  if (tab === 'configure') {
    showConfigureSubmenu.value = !showConfigureSubmenu.value
  }
  console.log({ tab })
}

type ConfigureProps = {
  currentTab?: ConfigureTabType
}

withDefaults(defineProps<ConfigureProps>(), {
  currentTab: 'dashboard',
})
</script>

<template>
  <aside class="configure-sidebar">
    <VCard class="configure-sidebar-card">
      <div class="logo">
        <img :src="ArcanaLogo" alt="Arcana Logo" />
      </div>
      <VStack direction="column" gap="1rem" class="configure-tabs flex-grow">
        <VCardButton
          v-for="tab in CONFIGURE_TABS"
          :key="`configure-sidebar-tab-${tab.type}`"
          :class="{ strong: currentTab === tab.type }"
          class="sidebar__option"
          :active="currentTab === tab.type"
        >
          <div
            class="sidebar__option-item"
            @click.stop="onClickOfMenu(tab.type)"
          >
            <img :src="tab.icon" alt="icon" class="sidebar__option-icon" />
            <span>{{ tab.label }}</span>
            <img
              v-if="tab.type === 'configure'"
              :src="arrowIcon"
              alt="arrow-icon"
              class="sidebar__option-arrow-icon"
              :class="{
                'sidebar__option-arrow-icon--active': showConfigureSubmenu,
              }"
            />
          </div>
          <div
            v-if="tab.subMenu && showConfigureSubmenu"
            class="sidebar__submenu"
          >
            <VCardButton
              v-for="subTab in tab.subMenu"
              :key="subTab.label"
              class="sidebar__submenu-option"
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

.sidebar__option-arrow-icon {
  width: 18px;
  height: 18px;
  margin-left: 4px;
  transition: ease 0.5s;
}

.sidebar__option-arrow-icon--active {
  transition: ease 0.5s;
  transform: rotate(180deg);
}

.strong {
  font-weight: 600 !important;
}
</style>
