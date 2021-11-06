<template>
  <div>
    <div class="banner" :class="{ hide: !showBanner }">
      <h4>Disclaimer:</h4>
      <h5>
        All features are in BETA stage of development. Use with caution as
        breaking changes could be made at any time.
      </h5>
      <span class="banner-close" @click.stop="onCloseBanner">X</span>
    </div>
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
  </div>
</template>

<style scoped>
.banner {
  background: linear-gradient(180deg, #0085ff -4.5%, #29c8fa 100.1%);
  padding: 0.75em 1.5em;
  color: white;
  font-family: var(--font-body);
  text-align: center;
  line-height: 1.5em;
}
.banner h4 {
  display: inline-block;
  font-weight: 600;
  text-transform: uppercase;
}
.banner h5 {
  display: inline-block;
  font-weight: 400;
  margin-left: 1em;
}
.banner.hide {
  display: none;
}
.banner-close {
  cursor: pointer;
  position: absolute;
  right: 2em;
  font-size: 1.25em;
  font-weight: 600;
}
</style>

<script>
import { computed, onMounted, ref } from "@vue/runtime-core";
import ArcanaLogo from "../assets/iconography/arcana-dark-vertical.svg";
import NotificationBellIcon from "../assets/iconography/notification-dot.svg";
import AccountUserIcon from "../assets/iconography/account-user.svg";
import MenuIcon from "../assets/iconography/menu.svg";
import ArcanaFavicon from "../assets/iconography/arcana-favicon.svg";
import VHeader from "./lib/VHeader/VHeader.vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import CancelIcon from "@/assets/iconography/cancel.svg";

export default {
  name: "AppHeader",
  components: { VHeader },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const showBanner = ref(true);
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
        // {
        //   label: "Help",
        //   action() {
        //     // router.push("/help");
        //   },
        //   selected: false,
        // },
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
      name: store.getters.userInfo.name,
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

    function onCloseBanner() {
      sessionStorage.setItem("hide-banner", true);
      showBanner.value = false;
    }

    onMounted(() => {
      showBanner.value = !sessionStorage.getItem("hide-banner");
    });

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
      CancelIcon,
      showBanner,
      onCloseBanner,
    };
  },
};
</script>