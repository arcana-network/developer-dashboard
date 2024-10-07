<script lang="ts" setup>
import { ref, onMounted, watch, computed, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import AppFallbackLogo from '@/assets/dapp-fallback.svg'
import arrowIcon from '@/assets/iconography/arrow.svg'
import brandingIcon from '@/assets/iconography/branding.svg'
import ChainIcon from '@/assets/iconography/chain.svg'
import CloseIcon from '@/assets/iconography/close.svg'
import dashboardIcon from '@/assets/iconography/dashboard.svg'
import GasStationIcon from '@/assets/iconography/gas-station.svg'
import KeyspaceIcon from '@/assets/iconography/keyspace.svg'
import sessionIcon from '@/assets/iconography/session.svg'
import settingsIcon from '@/assets/iconography/settings.svg'
import socialMediaIcon from '@/assets/iconography/user.svg'
import walletIcon from '@/assets/iconography/wallet.svg'
import VCard from '@/components/lib/VCard/VCard.vue'
import VCardButton from '@/components/lib/VCardButton/VCardButton.vue'
import VSeperator from '@/components/lib/VSeperator/VSeperator.vue'
import VStack from '@/components/lib/VStack/VStack.vue'
import { useAppsStore, type AppId, type AppConfig } from '@/stores/apps.store'
import { useAppId } from '@/use/getAppId'
import {
  WalletUIModes,
  isProductionDashboard,
  type ConfigureTab,
  type ConfigureTabType,
} from '@/utils/constants'

const appsStore = useAppsStore()
const showConfigureSubmenu = ref(false)
const showAppsList = ref(false)
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['switch-tab', 'switch-app'])
const apps: Ref<AppConfig[]> = ref([])

type ConfigureProps = {
  currentTab?: ConfigureTabType
  currentNetwork: 'testnet' | 'mainnet'
}

const props = withDefaults(defineProps<ConfigureProps>(), {
  currentTab: 'Dashboard',
  currentNetwork: 'testnet',
})

const ConfigureTabs = computed(() => {
  const configureTabsCopy = [
    { type: 'dashboard', label: 'Dashboard', icon: dashboardIcon },
    {
      type: 'configure',
      label: 'Configure',
      icon: settingsIcon,
      subMenu: [
        {
          type: 'branding',
          label: 'Branding',
          icon: brandingIcon,
        },
        {
          type: 'socialAuth',
          label: 'Social Auth',
          icon: socialMediaIcon,
        },

        {
          type: 'chainManagement',
          label: 'Chain Management',
          icon: ChainIcon,
        },
        {
          type: 'arcanaWallet',
          label: 'Arcana Wallet',
          icon: walletIcon,
        },
      ],
    },
    // { type: 'users', label: 'Users', icon: UserGroupIcon },
  ]
  const configurePageIndex = configureTabsCopy.findIndex(
    (tab) => tab.type === 'configure'
  )

  const appId = useAppId()
  const app = appsStore.app(appId)

  if (
    !isProductionDashboard ||
    (isProductionDashboard && app.network !== 'mainnet')
  ) {
    configureTabsCopy[configurePageIndex]?.subMenu?.push({
      type: 'sessionManagement',
      label: 'Login Session Management',
      icon: sessionIcon,
    })
  }

  if (app.wallet_mode === WalletUIModes[1].value) {
    configureTabsCopy[configurePageIndex]?.subMenu?.push({
      label: 'Keyspace',
      type: 'keyspace',
      icon: KeyspaceIcon,
    })
  }

  if (app.chain_type?.toLowerCase() === 'evm' || !app.chain_type) {
    configureTabsCopy[configurePageIndex]?.subMenu?.push({
      label: 'Gasless',
      type: 'gasless',
      icon: GasStationIcon,
    })
  }
  return configureTabsCopy
})

const gaslessMenu = [
  {
    type: 'gasTanks',
    label: 'Gas Tanks',
  },
  {
    type: 'address',
    label: 'Address',
  },
  // {
  //   type: 'transactions',
  //   label: 'Transactions',
  // },
]

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

function onAppClick(selectedAppId: AppId) {
  emit('switch-app', selectedAppId)
  showAppsList.value = false
}

function hasSubMenuSelected(tabLabel: string) {
  const selectedTab = ConfigureTabs.value.find((tab) => tab.label === tabLabel)
  if (selectedTab && selectedTab.subMenu) {
    const subTab = selectedTab.subMenu.find(
      (el) => el.label === props.currentTab
    )
    const gaslessSubmenu = gaslessMenu.find(
      (el) => el.label === props.currentTab
    )
    if (subTab || gaslessSubmenu) return true
  }
  return false
}

function isSubmenuSelected(subTab: string) {
  let isSelected = props.currentTab === subTab
  if (
    !isSelected &&
    subTab === 'Gasless' &&
    gaslessMenu.find((item) => item.label === props.currentTab)
  )
    isSelected = true
  return isSelected
}

onMounted(() => {
  const currentTab = props.currentTab
  showConfigureSubmenu.value =
    currentTab === 'Branding' ||
    currentTab === 'Social Auth' ||
    currentTab === 'Arcana Wallet' ||
    currentTab === 'Keyspace' ||
    currentTab === 'Gasless'
})

onMounted(() => {
  const appId = Number(route.params.appId)
  const app = appsStore.app(appId)
  if (!app) return
  const network = app?.network
  apps.value =
    network === 'mainnet'
      ? Object.values(appsStore.mainnetApps)
      : appsStore.apps
})

watch(
  () => Number(route.params.appId),
  () => {
    const appId = Number(route.params.appId)
    const app = appsStore.app(appId)
    if (!app) return
    const network = app?.network
    apps.value =
      network === 'mainnet'
        ? Object.values(appsStore.mainnetApps)
        : appsStore.apps
  }
)

function ellipsisAppName(appName: string) {
  if (appName.length > 6) {
    return `${appName.slice(0, 6)}...`
  }
  return appName
}
</script>

<template>
  <aside class="configure-sidebar w-60 h-full">
    <VCard
      class="configure-sidebar-card box-border flex flex-1 flex-col h-full p-8 pb-3 overflow-y-auto rounded-none"
    >
      <VStack direction="column" gap="1rem" class="configure-tabs flex-1 mb-8">
        <VStack
          class="apps-name__container relative w-full text-left flex flex-col pb-5"
        >
          <button
            class="flex space-x-2 justify-between app-name__container cursor-pointer flex items-center p-0 cursor-pointer bg-transparent border-0 outline-none"
            :title="appsStore.app(useAppId()).name"
            @click="showAppsList = !showAppsList"
          >
            <img
              :src="getlogo(useAppId())"
              alt="app logo"
              class="app-logo w-8 h-8"
            />
            <label
              class="text-ellipsis text-black_solid-default font-bold text-2xl overflow-hidden"
              >{{ ellipsisAppName(appsStore.app(useAppId()).name) }}</label
            >
            <img
              :src="arrowIcon"
              alt="arrow-icon"
              class="arrow-icon w-px18 h-px18 ml-1 opacity-50 transition ease-in-out duration-500"
              :class="{
                'arrow-icon--active opacity-100 transition ease-in-out duration-500 transform rotate-180':
                  showAppsList,
              }"
            />
          </button>
          <VCard
            v-if="showAppsList"
            class="apps-name__list-container border absolute top-0 right-rem-1 left-0 z-full-overlay flex flex-col gap-5 p-5 border-system-light_gray"
          >
            <button
              class="apps-name__close-btn absolute top-2.5 right-2.5 cursor-pointer bg-transparent border-0 outline-none"
              @click.stop="showAppsList = false"
            >
              <img :src="CloseIcon" alt="close" class="w-px15" />
            </button>
            <VCardButton
              v-for="app in apps"
              :key="app.name"
              class="apps-name__list-item flex gap-2 items-center justify-start p-0 mt-2.5 bg-transparent border-0 outline-none"
              :class="{ 'active-app': useAppId() === app.id }"
              @click="onAppClick(app.id)"
            >
              <img
                :src="getlogo(app.id)"
                alt="app logo"
                class="app-logo w-8 h-8 space-x-px5"
              />
              <span
                class="app-name text-base font-normal leading-6 text-left text-ellipsis overflow-hidden text-black_solid-default hover:text-fairy_dust-default space-x-px5"
                >{{ app.name }}</span
              >
            </VCardButton>
            <VSeperator
              class="app-full-bleed w-calc-full-add-rem2.5 mx--rem1.25"
            />
            <VCardButton
              class="apps-name__list-item flex gap-2 items-center justify-start p-0 mt-2.5 bg-transparent border-0 outline-none"
              @click="router.push({ name: 'ManageApps' })"
            >
              <img
                src="@/assets/iconography/manage.svg"
                alt="manage apps"
                class="app-icon w-6 h-6 p-1 space-x-px5"
              />
              <span
                class="app-name text-base font-normal leading-6 text-left text-ellipsis hover:text-fairy_dust-default space-x-px5"
                >Manage Apps</span
              >
            </VCardButton>
          </VCard>
        </VStack>
        <VSeperator
          class="full-bleed w-calc-full-add-rem4 mx--rem2 w-full text-left"
        />
        <VCardButton
          v-for="tab in ConfigureTabs"
          :key="`configure-sidebar-tab-${tab.type}`"
          :class="{
            'active-tab':
              props.currentTab === tab.label || hasSubMenuSelected(tab.label),
          }"
          class="sidebar__option w-full text-left flex flex-col gap-4 items-start justify-start py-2"
          @click.stop="onClickOfMenu(tab)"
        >
          <div
            class="sidebar__option-item flex flex-row gap-4 items-start justify-center hover:custom-filter"
          >
            <img
              :src="tab.icon"
              alt="icon"
              class="sidebar__option-icon custom-sidebar-filter"
              :class="{
                'custom-submenu-filter':
                  props.currentTab === tab.label ||
                  hasSubMenuSelected(tab.label),
              }"
            />
            <VStack gap="0.5rem" align="center">
              <span
                :class="[
                  'tab-label text-base font-normal leading-6 text-left',
                  props.currentTab === tab.label ||
                  hasSubMenuSelected(tab.label)
                    ? 'text-black_solid-default'
                    : 'text-whitemist-400',
                ]"
                >{{ tab.label }}</span
              >
              <img
                v-if="tab.subMenu"
                :src="arrowIcon"
                alt="arrow-icon"
                class="arrow-icon w-px18 h-px18 ml-1 opacity-50 transition ease-in-out duration-500"
                :class="{
                  'arrow-icon--active opacity-100 transition ease-in-out duration-500 transform rotate-180':
                    showConfigureSubmenu,
                }"
              />
            </VStack>
          </div>
          <div
            v-if="tab.subMenu && showConfigureSubmenu"
            class="sidebar__submenu | space-y-3 flex flex-col items-baseline justify-center mt-2 ml-5"
          >
            <div v-for="subTab in tab.subMenu" :key="subTab.label">
              <VCardButton
                class="sidebar__submenu-option relative p-0 hover:custom-filter"
                :class="{ 'submenu-active': isSubmenuSelected(subTab.label) }"
                @click.stop="onClickOfMenu(subTab)"
              >
                <div class="gap-3 flex flex-col">
                  <div
                    class="sidebar__submenu-option-item flex flex-row gap-3 items-start"
                  >
                    <img
                      :src="subTab.icon"
                      alt="icon"
                      class="sidebar__submenu-option-icon custom-sidebar-filter"
                      :class="{
                        'custom-submenu-filter': isSubmenuSelected(
                          subTab.label
                        ),
                      }"
                    />
                    <span
                      :class="[
                        'submenu-tab-label text-base font-normal leading-6 text-left',
                        isSubmenuSelected(subTab.label)
                          ? 'text-black_solid-default'
                          : 'text-whitemist-400',
                      ]"
                      >{{ subTab.label }}</span
                    >
                  </div>
                </div>
              </VCardButton>
            </div>
          </div>
        </VCardButton>
      </VStack>
    </VCard>
  </aside>
</template>
