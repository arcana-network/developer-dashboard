<template>
  <section :class="hideHeader ? 'hide-header' : ''">
    <div class="banner" :class="{ hide: !showBanner || hideBanner }">
      <h4>Disclaimer:</h4>
      <h5>
        This is an ALPHA release with all features being experimental. Please do
        not use important data without back ups.
      </h5>
      <span class="banner-close" @click.stop="onCloseBanner">X</span>
    </div>
    <v-header
      :logoSrc="ArcanaLogo"
      logoAlt="Arcana Logo"
      :loggedInUser="loggedInUser"
      :menuItems="menuItems"
      :selectedItem="selectedItem"
      :mobileMenuIcon="MenuIcon"
      :mobileLogo="ArcanaFavicon"
      :mobileAccountIcon="AccountUserIcon"
      @logo-click="onLogoClick"
    />
  </section>
</template>

<style scoped>
section {
  transition: transform 0.4s;
  width: 100%;
  z-index: 1000;
  position: sticky;
  top: 0;
}

.banner {
  background: linear-gradient(180deg, #0085ff -4.5%, #29c8fa 100.1%);
  padding: 0.75em 1.5em;
  color: white;
  font-family: var(--font-body);
  text-align: center;
  line-height: 1.5em;
  position: relative;
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
  margin-right: 2em;
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
.hide-header {
  transform: translateY(-100%);
}
</style>

<script>
import { computed, onMounted, ref, onUnmounted } from "@vue/runtime-core";
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
  props: {
    hideBanner: Boolean,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const showBanner = ref(true);
    const hideHeader = ref(false);

    let lastScrollTop = 0;
    const scrollDelta = 10;

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
      document.querySelector("#app").addEventListener("scroll", handleScroll);
    });

    onUnmounted(() => {
      document
        .querySelector("#app")
        .removeEventListener("scroll", handleScroll);
    });

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
      hideHeader,
    };
  },
};
</script>