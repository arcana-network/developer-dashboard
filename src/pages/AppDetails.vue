<script lang="ts" setup>
import { onBeforeMount, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

import ConfigureSidebar from '@/components/app-configure/ConfigureSidebar.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore } from '@/stores/apps.store'
import { useLoaderStore } from '@/stores/loader.store'
import { useAppId } from '@/use/getAppId'
import { Help_Items } from '@/utils/constants'
import { createTransactionSigner } from '@/utils/signerUtils'

const appsStore = useAppsStore()
const loaderStore = useLoaderStore()
const currentTab = ref('dashboard')
const router = useRouter()
const appId = useAppId()
const showHelpMenu = ref(false)

function switchTab(tab: string) {
  currentTab.value = tab
  router.push({
    params: { appId },
    path: tab,
  })
}

onBeforeMount(async () => {
  const appId = useAppId()
  loaderStore.showLoader('Fetching app config')
  await appsStore.fetchAndStoreAppConfig(appId)
  const address = appsStore.app(appId).address
  createTransactionSigner(address)
  loaderStore.hideLoader()
})
</script>

<template>
  <VStack direction="row" class="app-details__container">
    <div class="app-details__sidebar">
      <ConfigureSidebar :current-tab="currentTab" @switch-tab="switchTab" />
    </div>
    <VStack direction="column" class="app-details__content">
      <div class="flex justify-end help-button__container position-relative">
        <button class="help-button" @click.stop="showHelpMenu = !showHelpMenu">
          Help
        </button>
        <ul v-if="showHelpMenu" class="help-menu-items position-absolute">
          <li
            v-for="helpItem in Help_Items"
            :key="helpItem.label"
            class="cursor-pointer help-menu-item"
            @click.stop="showHelpMenu = false"
          >
            <a :href="helpItem.link" target="_blank">{{ helpItem.label }}</a>
          </li>
        </ul>
      </div>
      <RouterView />
    </VStack>
  </VStack>
</template>

<style scoped>
.app-details__container {
  display: flex;
  width: 100%;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}

.app-details__content {
  box-sizing: border-box;
  flex: 1;
  height: 100%;
  padding: 2rem;
  margin-top: 1rem;
  overflow-x: hidden;
  overflow-y: auto;
}

.help-button__container {
  margin-bottom: 4rem;
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
  top: 30px;
  right: 20px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 245px;
  padding: 0;
  padding: 1rem;
  background-color: #1f1f1f;
  border-radius: 10px;
  box-shadow: -4px -5px 4px rgb(0 0 0 / 20%), 4px 5px 4px rgb(0 0 0 / 20%);
}

.help-menu-item {
  width: 100%;
  padding: 0.5rem;
  font-family: var(--font-body);
  color: var(--text-white);
  list-style: none;
  background-color: #1f1f1f;
}

.help-menu-items a {
  color: white;
  text-decoration: none;
}
</style>
