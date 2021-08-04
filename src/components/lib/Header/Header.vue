<template>
  <header>
    <div class="container"></div>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  background: #1f1f1f;
  box-shadow: 0px 9px 25px rgba(15, 15, 15, 0.25);
  z-index: 1000;
  position: sticky;
  top: 0;
  padding-top: 1em;
  padding-bottom: 1em;
}
</style>

<script>
import { computed } from "@vue/runtime-core";
import Logo from "@/assets/logo.png";
export default {
  props: {
    logoSrc: String,
    logoAlt: String,
    menuItems: Array,
    loggedInUser: Object,
    showNotificationBell: Boolean,
    hasNotifications: Boolean,
    height: Number,
    width: Number,
  },
  setup(props, { emit }) {
    const logoAltText = computed(() => {
      return props.logoAlt || document.title || "Header image";
    });

    function handleMenuItemClick(menuItem) {
      if (menuItem.action) {
        menuItem.action.call();
      } else {
        emit("header-menu-item-click", menuItem);
      }
    }

    return {
      logoAltText,
      handleMenuItemClick,
      Logo,
    };
  },
};
</script>