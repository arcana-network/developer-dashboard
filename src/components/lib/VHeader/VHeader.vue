<template>
  <header :class="hideHeader ? 'hide-header' : ''">
    <section class="container flex" style="margin-bottom: 0">
      <div
        class="logo laptop-remove"
        v-if="logoSrc"
        v-wave="{
          color: 'rgb(196,196,196)',
          initialOpacity: 0.4,
          finalOpacity: 0.1,
        }"
        @click="showMenu = !showMenu"
      >
        <img style="margin-top: 10px" :src="mobileMenuIcon" />
      </div>
      <div
        class="logo"
        v-if="logoSrc"
        v-wave="{
          color: 'rgb(196,196,196)',
          initialOpacity: 0.4,
          finalOpacity: 0.1,
        }"
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
          class="flex menu tablet-remove"
          role="listbox"
          v-if="menuItems && menuItems.length"
          style="gap: 1em"
        >
          <li
            v-for="menuItem in menuItems"
            :key="menuItem.label"
            role="listitem"
            class="menu-item"
            @click.stop="handleMenuItemClick(menuItem)"
            :class="
              selectedItem === 'menu-item' && menuItem.selected
                ? 'menu-item-selected'
                : ''
            "
            v-wave="{
              color: 'rgb(196,196,196)',
              initialOpacity: 0.4,
              finalOpacity: 0.1,
            }"
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
        <ul class="flex menu tablet-remove" role="listbox" v-if="loggedInUser">
          <li
            role="listitem"
            class="menu-item"
            :class="selectedItem === 'profile' ? 'menu-item-selected' : ''"
            @click.stop="handleUserClick"
            style="
              width: max-content;
              max-width: 200px;
              overflow: hidden;
              word-wrap: nowrap;
              text-overflow: ellipsis;
              text-align: center;
            "
            v-wave="{
              color: 'rgb(196,196,196)',
              initialOpacity: 0.4,
              finalOpacity: 0.1,
            }"
          >
            {{ loggedInUser.name }}
          </li>
        </ul>
      </div>
      <div
        class="logo laptop-remove"
        v-if="logoSrc"
        v-wave="{
          color: 'rgb(196,196,196)',
          initialOpacity: 0.4,
          finalOpacity: 0.1,
        }"
        @click.stop="handleUserClick"
        style="margin-left: auto; cursor: pointer"
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
        class="flex column menu"
        role="listbox"
        v-if="menuItems && menuItems.length"
      >
        <li
          v-for="menuItem in menuItems"
          :key="menuItem.label"
          role="listitem"
          class="menu-item"
          @click.stop="handleMenuItemClick(menuItem)"
          :class="
            selectedItem === 'menu-item' && menuItem.selected
              ? 'menu-item-selected'
              : ''
          "
          v-wave="{
            color: 'rgb(196,196,196)',
            initialOpacity: 0.4,
            finalOpacity: 0.1,
          }"
        >
          {{ menuItem.label }}
        </li>
      </ul>
    </aside>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  background: #1f1f1f;
  box-shadow: 0px 9px 25px rgba(15, 15, 15, 0.25);
  z-index: 1000;
  position: sticky;
  display: flex;
  top: 0;
  opacity: 1;
  transition: opacity 0.4s;
  visibility: visible;
}

aside {
  z-index: 10000;
  width: 100%;
  top: 100%;
  position: absolute;
  background: linear-gradient(143.36deg, #0f0f0f -4.7%, #000000 115.05%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.6s, visibility 0.6s;
}

aside ul {
  margin: 0;
  padding: 0;
}

aside ul li {
  text-align: center;
  padding: 1.5em 1em !important;
}

aside.show {
  visibility: visible;
  opacity: 1;
}

ul {
  margin-top: 0;
  margin-bottom: 0;
}

.mobile-menu-icon {
  display: none;
}

.hide-header {
  opacity: 0;
  visibility: hidden;
}
header section {
  justify-content: space-between;
}
.menu-item {
  list-style: none !important;
  color: white;
  font-family: var(--font-title);
  font-weight: 700;
  font-size: 1.125em;
  line-height: 1.375em;
}
.logo,
.menu-item,
.notification-icon {
  cursor: pointer;
  padding: 2em 1em;
  transition: opacity 0.3s;
}
.notification-icon {
  margin-left: 4em;
  margin-top: -0.3em;
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
    cursor: pointer;
    padding: 1em 1em;
    transition: opacity 0.3s;
  }
  header section {
    justify-content: unset;
  }
}
</style>

<script>
import { computed, onMounted, onUnmounted, ref } from "@vue/runtime-core";
export default {
  name: "VHeader",
  props: {
    logoSrc: String,
    logoAlt: String,
    menuItems: Array,
    loggedInUser: Object,
    notificationIcon: [Object, String],
    hasNotifications: Boolean,
    height: Number,
    width: Number,
    hideOnScroll: Boolean,
    logoStyle: [String, Object],
    selectedItem: String,
    mobileMenuIcon: [Object, String],
    mobileAccountIcon: [Object, String],
    mobileLogo: [Object, String],
  },
  setup(props, { emit }) {
    const logoAltText = computed(() => {
      return props.logoAlt || document.title || "Header image";
    });

    const showMenu = ref(false);

    const hideHeader = ref(false);

    let lastScrollTop = 0;
    const scrollDelta = 10;

    function handleScroll(ev) {
      const scrollTop = ev.target.scrollTop;
      if (!hideHeader.value && scrollTop > lastScrollTop + scrollDelta) {
        hideHeader.value = true;
      } else if (hideHeader.value && scrollTop < lastScrollTop) {
        hideHeader.value = false;
      }
      if (ev.target.scrollHeight - scrollTop === ev.target.clientHeight) {
        hideHeader.value = false;
      }
      lastScrollTop = ev.target.scrollTop;
    }

    onMounted(() => {
      if (props.hideOnScroll)
        document.querySelector("#app").addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      if (props.hideOnScroll)
        document
          .querySelector("#app")
          .removeEventListener("scroll", handleScroll);
    });

    function handleMenuItemClick(menuItem) {
      if (menuItem.action) {
        menuItem.action.call();
      }
      return emit("header-menu-item-click", menuItem);
    }

    function handleUserClick() {
      if (props.loggedInUser?.action) {
        props.loggedInUser.action.call();
      }
      return emit("user-click");
    }

    function onLogoClick() {
      return emit("logo-click");
    }

    return {
      logoAltText,
      hideHeader,
      showMenu,
      handleMenuItemClick,
      handleUserClick,
      onLogoClick,
    };
  },
};
</script>