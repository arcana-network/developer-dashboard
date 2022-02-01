<template>
  <div class="body-1">Redirecting...</div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import constants from "../utils/constants";
import {
  getNonce,
  login,
  getArcanaAuth,
  addUserToMailchimp,
} from "@/services/auth.service";
import sign from "@/services/sign";
import { Wallet } from "ethers";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import { AuthProvider } from "@arcana/auth";

export default {
  setup() {
    const router = useRouter();
    const store = useStore();

    onMounted(async () => {
      const arcanaAuth = await getArcanaAuth();
      console.log({ isLoggedIn: arcanaAuth.isLoggedIn() });
      const { userInfo, privateKey } = arcanaAuth.getUserInfo();
      const wallet = new Wallet(privateKey);
      const nonce = await getNonce(wallet.address);
      const signature = await sign(privateKey, nonce.data);
      const access_token = await login({
        signature,
        email: userInfo.id,
        address: wallet.address,
      });
      store.dispatch("updateAccessToken", access_token.data.token);
      store.dispatch("updateKeys", {
        privateKey,
      });
      store.dispatch("updateWalletAddress", wallet.address);
      store.dispatch("updateUserInfo", {
        email: userInfo.id,
        name: userInfo.name || "",
      });

      if (nonce.data === 0) {
        addUserToMailchimp(userInfo.id);
      }

      if (localStorage.getItem("skipPassword") !== "true") {
        router.push({
          name: "Create Password",
          params: { redirectTo: "Dashboard" },
        });
      } else {
        router.push({
          name: "Dashboard",
        });
      }
    });
  },
};
</script>