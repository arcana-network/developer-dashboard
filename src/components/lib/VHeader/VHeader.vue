<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps({
  logoSrc: String,
  logoAlt: String,
  menuItems: Array,
  loggedInUser: Object,
  notificationIcon: [Object, String],
  hasNotifications: Boolean,
  height: Number,
  width: Number,
  logoStyle: [String, Object],
  selectedItem: String,
  mobileMenuIcon: [Object, String],
  mobileAccountIcon: [Object, String],
  mobileLogo: [Object, String],
})

const emit = defineEmits(['header-menu-item-click', 'user-click', 'logo-click'])

const logoAltText = computed(() => {
  return props.logoAlt || document.title || 'Header image'
})

const showMenu = ref(false)

function handleMenuItemClick(menuItem) {
  if (menuItem.action) {
    menuItem.action.call()
  }
  return emit('header-menu-item-click', menuItem)
}

function handleUserClick() {
  if (props.loggedInUser?.action) {
    props.loggedInUser.action.call()
  }
  return emit('user-click')
}

function onLogoClick() {
  return emit('logo-click')
}
</script>

<template>
  <header>
    <section class="container flex" style="margin-bottom: 0">
      <div
        v-if="logoSrc"
        v-wave="{
          color: 'rgb(196,196,196)',
          initialOpacity: 0.4,
          finalOpacity: 0.1,
        }"
        class="logo laptop-remove"
        @click="showMenu = !showMenu"
      >
        <img style="margin-top: 10px" :src="mobileMenuIcon" />
      </div>
      <div
        v-if="logoSrc"
        v-wave="{
          color: 'rgb(196,196,196)',
          initialOpacity: 0.4,
          finalOpacity: 0.1,
        }"
        class="logo"
        @click.stop="onLogoClick"
      >
        <img class="tablet-remove" :src="logoSrc" :alt="logoAlt" />
        <img
          class="laptop-remove"
          :src="mobileLogo"
          :alt="logoAlt"
          style="margin-top: 2px"
        />
      </div>
      <div class="flex">
        <ul
          v-if="menuItems && menuItems.length"
          class="flex menu tablet-remove"
          role="listbox"
          style="gap: 1em"
        >
          <li
            v-for="menuItem in menuItems"
            :key="menuItem.label"
            v-wave="{
              color: 'rgb(196,196,196)',
              initialOpacity: 0.4,
              finalOpacity: 0.1,
            }"
            role="listitem"
            class="menu-item"
            :class="
              selectedItem === 'menu-item' && menuItem.selected
                ? 'menu-item-selected'
                : ''
            "
            @click.stop="handleMenuItemClick(menuItem)"
          >
            {{ menuItem.label }}
          </li>
        </ul>
        <img
          v-if="notificationIcon"
          :src="notificationIcon"
          alt="Notification"
          class="notification-icon mobile-remove"
        />
        <ul v-if="loggedInUser" class="flex menu tablet-remove" role="listbox">
          <li
            v-wave="{
              color: 'rgb(196,196,196)',
              initialOpacity: 0.4,
              finalOpacity: 0.1,
            }"
            role="listitem"
            class="menu-item"
            :class="selectedItem === 'profile' ? 'menu-item-selected' : ''"
            style="
              width: max-content;
              max-width: 200px;
              overflow: hidden;
              text-align: center;
              text-overflow: ellipsis;
              word-wrap: nowrap;
            "
            @click.stop="handleUserClick"
          >
            {{ loggedInUser.name }}
          </li>
        </ul>
      </div>
      <div
        v-if="logoSrc"
        v-wave="{
          color: 'rgb(196,196,196)',
          initialOpacity: 0.4,
          finalOpacity: 0.1,
        }"
        class="logo laptop-remove"
        style="margin-left: auto; cursor: pointer"
        @click.stop="handleUserClick"
      >
        <img
          class="laptop-remove"
          :src="mobileAccountIcon"
          style="margin-top: 5px"
        />
      </div>
    </section>
    <aside :class="{ show: showMenu }" class="laptop-remove">
      <ul
        v-if="menuItems && menuItems.length"
        class="flex column menu"
        role="listbox"
      >
        <li
          v-for="menuItem in menuItems"
          :key="menuItem.label"
          v-wave="{
            color: 'rgb(196,196,196)',
            initialOpacity: 0.4,
            finalOpacity: 0.1,
          }"
          role="listitem"
          class="menu-item"
          :class="
            selectedItem === 'menu-item' && menuItem.selected
              ? 'menu-item-selected'
              : ''
          "
          @click.stop="handleMenuItemClick(menuItem)"
        >
          {{ menuItem.label }}
        </li>
      </ul>
    </aside>
  </header>
</template>

<style scoped>
header {
  display: flex;
  visibility: visible;
  background: #1f1f1f;
  box-shadow: 0 9px 25px rgb(15 15 15 / 25%);
  transition: transform 0.6s;
}

aside {
  position: absolute;
  top: 100%;
  z-index: 10000;
  width: 100%;
  visibility: hidden;
  background: linear-gradient(143.36deg, #0f0f0f -4.7%, #000 115.05%);
  opacity: 0;
  transition: opacity 0.6s, visibility 0.6s;
}

ul {
  margin-top: 0;
  margin-bottom: 0;
}

aside ul {
  padding: 0;
  margin: 0;
}

aside ul li {
  padding: 1.5em 1em !important;
  text-align: center;
}

aside.show {
  visibility: visible;
  opacity: 1;
}

.mobile-menu-icon {
  display: none;
}

.hide-header {
  transform: translateY(-100%);
}

header section {
  justify-content: space-between;
}

.menu-item {
  font-family: var(--font-title);
  font-size: 1.125em;
  font-weight: 700;
  line-height: 1.375em;
  color: white;
  list-style: none !important;
}

.logo,
.menu-item,
.notification-icon {
  padding: 2em 1em;
  cursor: pointer;
  transition: opacity 0.3s;
}

.notification-icon {
  margin-top: -0.3em;
  margin-left: 4em;
}

.logo:hover,
.notification-icon:hover {
  opacity: 0.6;
}

.menu-item:hover {
  color: #00519c;
}

.menu-item-selected {
  color: #13a3fd;
}

@media only screen and (max-width: 1023px) {
  .logo,
  .menu-item,
  .notification-icon {
    padding: 1em;
    cursor: pointer;
    transition: opacity 0.3s;
  }

  header section {
    justify-content: unset;
  }
}
</style>
