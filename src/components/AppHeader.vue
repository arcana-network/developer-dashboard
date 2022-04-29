<script lang="ts" setup>
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import AccountUserIcon from '@/assets/iconography/account-user.svg'
import ArcanaLogo from '@/assets/iconography/arcana-dark-vertical.svg'
import ArcanaFavicon from '@/assets/iconography/arcana-favicon.svg'
import MenuIcon from '@/assets/iconography/menu.svg'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import VHeader from '@/components/lib/VHeader/VHeader.vue'

defineProps({
  hideBanner: {
    type: Boolean,
    default: true,
  },
})

const route = useRoute()
const router = useRouter()
const store = useStore()
const showBanner = ref(true)
const hideHeader = ref(false)

let lastScrollTop = 0
const scrollDelta = 10

const menuItems = computed(() => {
  let arr = [
    {
      label: 'Dashboard',
      action() {
        router.push('/')
      },
      selected: false,
    },
    {
      label: 'Users',
      action() {
        router.push('/users')
      },
      selected: false,
    },
    {
      label: 'Docs',
      action() {
        window.open('https://docs.arcana.network')
      },
      selected: false,
    },
  ]
  if (route.name === 'Dashboard') {
    arr[0].selected = true
  } else if (route.name === 'Users') {
    arr[1].selected = true
  }
  return arr
})

const loggedInUser = {
  name: store.getters.userInfo.name,
  action() {
    router.push('/profile')
  },
}

const selectedItem = computed(() => {
  if (route.name === 'Profile') {
    return 'profile'
  } else if (route.name === 'Notification') {
    return 'notification'
  } else {
    return 'menu-item'
  }
})

function onLogoClick() {
  router.push('/')
}

function onCloseBanner() {
  sessionStorage.setItem('hide-banner', 'true')
  showBanner.value = false
}

onMounted(() => {
  showBanner.value = !sessionStorage.getItem('hide-banner')
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
    <div class="banner" :class="{ hide: !showBanner || hideBanner }">
      <h4>Disclaimer:</h4>
      <h5>
        This is an ALPHA release with all features being experimental. Please do
        not use important data without backups.
      </h5>
      <span class="banner-close" role="button" @click.stop="onCloseBanner">
        <CloseIcon color="#FFFFFF" />
      </span>
    </div>
    <v-header
      :logo-src="ArcanaLogo"
      logo-alt="Arcana Logo"
      :logged-in-user="loggedInUser"
      :menu-items="menuItems"
      :selected-item="selectedItem"
      :mobile-menu-icon="MenuIcon"
      :mobile-logo="ArcanaFavicon"
      :mobile-account-icon="AccountUserIcon"
      @logo-click="onLogoClick"
    />
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

.hide-header {
  transform: translateY(-100%);
}
</style>
