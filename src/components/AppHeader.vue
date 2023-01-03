<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import ArcanaLogo from '@/assets/iconography/arcana-dark-vertical.svg'
import BlueCloseIcon from '@/assets/iconography/close.svg'
import MenuIcon from '@/assets/iconography/menu.svg'
import CloseIcon from '@/components/icons/CloseIcon.vue'

const router = useRouter()
const canShowBanner = ref(true)
const hideHeader = ref(false)
const showHelpMenu = ref(false)
const showMenu = ref(false)

let lastScrollTop = 0
const scrollDelta = 10

const helpItems = [
  {
    label: 'View Docs',
    action() {
      router.push({ name: 'ManageApps' })
    },
    selected: false,
  },
  {
    label: 'Schedule a Demo',
    action() {
      router.push({ name: 'ManageApps' })
    },
    selected: false,
  },
  {
    label: 'Get Support',
    action() {
      router.push({ name: 'ManageApps' })
    },
    selected: false,
  },
  {
    label: 'Report a Bug',
    action() {
      router.push({ name: 'ManageApps' })
    },
    selected: false,
  },
  {
    label: 'Request a Feature',
    action() {
      router.push({ name: 'ManageApps' })
    },
    selected: false,
  },
]

function onLogoClick() {
  router.push('/')
}

function onCloseBanner() {
  sessionStorage.setItem('hide-banner', 'true')
  canShowBanner.value = false
}

onMounted(() => {
  canShowBanner.value = !sessionStorage.getItem('hide-banner')
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
</script>

<template>
  <section :class="hideHeader ? 'hide-header' : ''">
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
    <header class="container flex">
      <div class="logo" @click.stop="onLogoClick">
        <img :src="ArcanaLogo" alt="Arcana Logo" />
      </div>
      <div class="position-relative flex flex-center">
        <button class="help-button" @click.stop="showHelpMenu = !showHelpMenu">
          Help
        </button>
        <button
          class="mobile-menu-icon-button cursor-pointer"
          @click.stop="showMenu = !showMenu"
        >
          <img v-if="showMenu" :src="BlueCloseIcon" alt="close icon" />
          <img v-else :src="MenuIcon" alt="Menu icon" />
        </button>
        <ul v-if="showHelpMenu" class="help-menu-items position-absolute">
          <li
            v-for="helpItem in helpItems"
            :key="helpItem.label"
            class="cursor-pointer help-menu-item"
            @click.stop="showHelpMenu = false"
          >
            {{ helpItem.label }}
          </li>
        </ul>
      </div>
    </header>
  </section>
</template>

<style scoped>
section {
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
  width: 100%;
  padding: 1.5rem 0;
  margin: 0 1rem;
  visibility: visible;
  background: #1f1f1f;
  transition: transform 0.6s;
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
  margin-right: 2rem;
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

@media only screen and (max-width: 767px) {
  .help-button {
    display: none;
  }
}

@media only screen and (min-width: 768px) {
  .mobile-menu-icon-button {
    display: none;
  }
}

@media only screen and (max-width: 1023px) {
  header {
    padding: 1rem 0;
  }
}

.banner {
  position: relative;
  padding: 0.75em 1.5em;
  font-family: var(--font-body);
  line-height: 1.5em;
  color: white;
  text-align: center;
  background: linear-gradient(180deg, #0085ff -4.5%, #29c8fa 100.1%);
}

.banner h4 {
  display: inline-block;
  font-weight: 600;
  text-transform: uppercase;
}

.banner h5 {
  display: inline-block;
  margin-right: 2em;
  margin-left: 1em;
  font-weight: 400;
}

.banner.hide {
  display: none;
}

.banner-close {
  position: absolute;
  right: 2em;
  cursor: pointer;
}
</style>
