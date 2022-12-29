<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = defineProps({
  logoSrc: {
    type: String,
    default: '',
  },
  logoAlt: {
    type: String,
    default: '',
  },
  helpItems: {
    type: Array,
    required: true,
  },
  notificationIcon: {
    type: [Object, String],
    default: '',
  },
  hasNotifications: {
    type: Boolean,
    default: false,
  },
  mobileMenuIcon: {
    type: [Object, String],
    default: '',
  },
  closeIcon: {
    type: [Object, String],
    default: '',
  },
})

const emit = defineEmits(['header-menu-item-click', 'user-click', 'logo-click'])

const logoAltText = computed(() => {
  return props.logoAlt || document.title || 'Header image'
})

const showMenu = ref(false)
const showHelpMenu = ref(false)

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
        class="logo"
        @click.stop="onLogoClick"
      >
        <img :src="logoSrc" :alt="logoAltText" />
      </div>
      <div class="position-relative flex flex-center">
        <button class="help-button" @click.stop="showHelpMenu = !showHelpMenu">
          Help
        </button>
        <button
          class="mobile-menu-icon-button cursor-pointer"
          @click.stop="showMenu = !showMenu"
        >
          <img v-if="showMenu" :src="closeIcon" alt="close icon" />
          <img v-else :src="mobileMenuIcon" :alt="logoAltText" />
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
    </section>
  </header>
</template>

<style scoped>
header {
  position: relative;
  display: flex;
  padding: 1.5rem 0;
  visibility: visible;
  background: #1f1f1f;
  transition: transform 0.6s;
}

.mobile-menu {
  position: absolute;
  top: 100%;
  z-index: 10000;
  width: 100%;
  height: 100vh;
  visibility: hidden;
  background-color: #262626;
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
  padding: 1em;
  text-align: center;
}

aside.show {
  visibility: visible;
  opacity: 1;
}

.mobile-menu-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: transparent;
  border: none;
  outline: none;
}

.hide-header {
  transform: translateY(-100%);
}

header section {
  justify-content: space-between;
}

.menu-item {
  display: flex;
  align-items: center;
  font-family: var(--font-title);
  font-size: 1.125em;
  font-weight: 700;
  line-height: 1.375em;
  color: white;
  list-style: none !important;
}

.logo,
.menu-item {
  cursor: pointer;
  transition: opacity 0.3s;
}

.logo img {
  vertical-align: middle;
}

.logo:hover {
  opacity: 0.6;
}

.menu-item:hover {
  color: #00519c;
}

.menu-item-selected {
  color: #13a3fd;
}

.menu-item-disabled {
  pointer-events: none;
  opacity: 0.25;
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
  .logo,
  .menu-item {
    cursor: pointer;
    transition: opacity 0.3s;
  }

  header {
    padding: 1rem 0;
  }
}
</style>
