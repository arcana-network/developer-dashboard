<template>
  <v-header
    :logoSrc="ArcanaLogo"
    logoAlt="Arcana Logo"
    :loggedInUser="loggedInUser"
    :menuItems="menuItems"
    :hideOnScroll="true"
    :selectedItem="selectedItem"
    :mobileMenuIcon="MenuIcon"
    :mobileLogo="ArcanaFavicon"
    :mobileAccountIcon="AccountUserIcon"
    @logo-click="onLogoClick"
  />
</template>

<style scoped>
</style>

<script>
import { computed } from "@vue/runtime-core";
import ArcanaLogo from "../assets/iconography/arcana-dark-vertical.svg";
import NotificationBellIcon from "../assets/iconography/notification-dot.svg";
import AccountUserIcon from "../assets/iconography/account-user.svg";
import MenuIcon from "../assets/iconography/menu.svg";
import ArcanaFavicon from "../assets/iconography/arcana-favicon.svg";
import VHeader from "./lib/VHeader/VHeader.vue";
import { useRoute, useRouter } from "vue-router";
export default {
  name: "AppHeader",
  components: { VHeader },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const menuItems = computed(() => {
      let arr = [
        {
          label: "Dashboard",
          action() {
            router.push("/");
          },
          selected: false,
        },
        {
          label: "Users",
          action() {
            router.push("/users");
          },
          selected: false,
        },
        {
          label: "Help",
          action() {
            // router.push("/help");
          },
          selected: false,
        },
        {
          label: "Docs",
          action() {
            // window.open("https://google.com");
          },
          selected: false,
        },
      ];
      if (route.name === "Dashboard") {
        arr[0].selected = true;
      } else if (route.name === "Users") {
        arr[1].selected = true;
      }
      return arr;
    });

    const loggedInUser = {
      name: "John Doe",
      action() {
        router.push("/profile");
      },
    };

    const selectedItem = computed(() => {
      if (route.name === "Profile") {
        return "profile";
      } else if (route.name === "Notification") {
        return "notification";
      } else {
        return "menu-item";
      }
    });

    function onLogoClick() {
      router.push("/");
    }

    return {
      menuItems,
      ArcanaLogo,
      NotificationBellIcon,
      selectedItem,
      loggedInUser,
      AccountUserIcon,
      ArcanaFavicon,
      MenuIcon,
      onLogoClick,
    };
  },
};
</script>