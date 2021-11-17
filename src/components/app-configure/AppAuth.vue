<template>
  <v-card
    style="margin-top: 2em; padding: 1.5em 2em; gap: 1.2em"
    class="column"
    :id="'configure-step-' + 4"
  >
    <h4 style="width: 100%; display: block">CHOOSE LOGIN TYPE</h4>
    <div class="flex sm-column" style="gap: 4vw">
      <div
        class="flex column"
        style="
          gap: 1.2em;
          align-items: flex-start;
          width: 22vw;
          min-width: 280px;
        "
      >
        <span class="body-1" style="color: var(--text-grey)">
          Your users can bring their own public and private keys or be assigned
          a pair of them upon registration through our trustless Distributed Key
          Generation system. These are ECDSA keys on the secp256k1 curve which
          work with any EVM compatible chains.
        </span>
        <v-button
          variant="link"
          label="LEARN MORE"
          :action="onLearnMoreClicked"
        />
      </div>
      <div class="flex column">
        <div class="flex input-group">
          <v-dropdown
            :options="authenticationTypes"
            displayField="name"
            placeholder="Auth Type"
            style="min-width: 160px"
            v-model="selectedAuthenticationType"
          />
          <v-text-field
            v-if="selectedAuthenticationType"
            :placeholder="
              selectedAuthenticationType.idName
                ? 'Enter ' + selectedAuthenticationType.idName
                : 'Enter Client ID'
            "
            v-model="selectedAuthClientId"
            :messageType="selectedAuthClientIdError ? 'error' : ''"
            :message="errorMessage"
          />
          <v-text-field
            v-if="
              selectedAuthenticationType &&
              selectedAuthenticationType.secretRequired
            "
            :placeholder="
              selectedAuthenticationType.idSecret
                ? 'Enter ' + selectedAuthenticationType.idSecret
                : 'Enter Client Secret'
            "
            v-model="selectedAuthClientSecret"
            @keyup.enter="addAuthentication"
          />
          <v-text-field
            v-if="
              selectedAuthenticationType &&
              selectedAuthenticationType.redirectUrlRequired
            "
            placeholder="Enter Redirect Url"
            v-model="selectedAuthRedirectUrl"
          />
          <div v-if="selectedAuthenticationType" style="margin-top: 1em">
            <v-tooltip title="Add">
              <v-icon-button
                :icon="CheckIcon"
                style="margin-left: 1em"
                @click.stop="addAuthentication"
              />
            </v-tooltip>
            <v-tooltip title="Clear">
              <v-icon-button
                :icon="CancelIcon"
                style="margin-left: 1em"
                @click.stop="clearAuthentication"
              />
            </v-tooltip>
          </div>
        </div>
        <div
          v-if="selectedAuthenticationType"
          style="overflow-x: hidden; text-overflow: ellipsis"
        >
          <span class="body-2" style="line-height: 1.5em">
            To get the required credentials visit
            <br />
            <a
              :href="selectedAuthenticationType.setup"
              target="__blank"
              class="auth-link"
              style="
                font-weight: 400;
                letter-spacing: 0.5px;
                font-size: 1em;
                overflow-wrap: break-word;
              "
            >
              {{ selectedAuthenticationType.setup }}
            </a>
          </span>
          <div
            v-if="selectedAuthenticationType?.additionalSteps"
            style="margin-top: 0.5em"
          >
            <span class="body-2">
              <strong>Note: </strong>
              {{ selectedAuthenticationType.additionalSteps }}
            </span>
          </div>
        </div>
        <div class="flex flex-wrap" style="gap: 2em; margin-top: 1em">
          <v-tooltip
            v-for="(authDetail, index) in authenticationDetails"
            :key="authDetail"
            :title="getAuthTooltip(authDetail)"
            tooltip-style=" word-wrap: break-word;"
          >
            <v-chip
              :cancellable="true"
              @cancel="removeAuthentication(index)"
              style="
                max-width: 240px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              "
            >
              <span class="body-1">
                {{ getAuthTooltip(authDetail) }}
              </span>
            </v-chip>
          </v-tooltip>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { ref } from "@vue/reactivity";
import VTextField from "@/components/lib/VTextField/VTextField.vue";
import VCard from "@/components/lib/VCard/VCard.vue";
import VButton from "@/components/lib/VButton/VButton.vue";
import VDropdown from "@/components/lib/VDropdown/VDropdown.vue";
import VChip from "@/components/lib/VChip/VChip.vue";
import { computed, watch } from "@vue/runtime-core";
import { useStore } from "vuex";
import PlusIcon from "@/assets/iconography/plus.svg";
import CancelIcon from "@/assets/iconography/close.svg";
import CheckIcon from "@/assets/iconography/check.svg";
import VTooltip from "@/components/lib/VTooltip/VTooltip.vue";
import VIconButton from "../lib/VIconButton/VIconButton.vue";
import VCardButton from "../lib/VCardButton/VCardButton.vue";

export default {
  name: "ConfigureAppAuth",
  props: {
    isConfigured: Boolean,
  },
  components: {
    VCard,
    VChip,
    VButton,
    VDropdown,
    VTextField,
    VTooltip,
    VIconButton,
    VCardButton,
  },
  setup(props) {
    const store = useStore();
    let authToRemove = [];
    const authenticationTypes = [
      // "Bring Your Own Keys",
      {
        name: "Google",
        setup: "https://developers.google.com/identity/sign-in/web/sign-in",
      },
      {
        name: "GitHub",
        secretRequired: true,
        setup:
          "https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app",
      },
      {
        name: "Reddit",
        setup: "https://github.com/reddit-archive/reddit/wiki/OAuth2",
        additionalSteps: "Select installed app to be get proper client id",
      },
      {
        name: "Discord",
        setup: "https://canary.discord.com/developers/applications",
      },
      {
        name: "Twitter",
        secretRequired: true,
        redirectUrlRequired: true,
        idName: "API Key",
        idSecret: "API Secret",
        setup: "https://developer.twitter.com/en/docs/apps/overview",
      },
      {
        name: "Twitch",
        setup: "https://dev.twitch.tv/docs/authentication#registration",
      },
    ];
    let authenticationDetails = ref([]);
    const env = computed(() => {
      return store.getters.env;
    });
    authenticationDetails.value = [
      ...store.getters[env.value + "/authDetails"],
    ];
    let selectedAuthClientIdError = ref(false);
    let selectedAuthenticationType = ref("");
    let selectedAuthClientId = ref("");
    let selectedAuthClientSecret = ref("");
    let selectedAuthRedirectUrl = ref("");
    let errorMessage = ref("");

    function addAuthentication() {
      if (
        selectedAuthClientId.value.trim() &&
        selectedAuthenticationType.value.name
      ) {
        const type =
          selectedAuthenticationType.value.name === "Bring Your Own Keys"
            ? "user-keys"
            : selectedAuthenticationType.value.name.toLowerCase();
        if (
          !authenticationDetails.value.find(
            (authDetail) => authDetail.type === type.toLowerCase()
          )
        ) {
          if (
            selectedAuthenticationType.value.secretRequired &&
            !selectedAuthClientSecret.value.trim()
          ) {
            selectedAuthClientIdError.value = true;
            errorMessage.value = "Enter all details to continue";
            return;
          }
          if (authToRemove.includes(type)) {
            authToRemove.splice(authToRemove.indexOf(type), 1);
            store.dispatch(env.value + "/updateAuthToRemove", authToRemove);
          }
          authenticationDetails.value.push({
            type,
            verifier: type,
            authType: type,
            clientId: selectedAuthClientId.value.trim(),
            redirectUrl: selectedAuthRedirectUrl.value.trim(),
            clientSecret: selectedAuthenticationType.value.secretRequired
              ? selectedAuthClientSecret.value.trim()
              : undefined,
          });
          store.dispatch(
            env.value + "/updateAuthDetails",
            authenticationDetails.value
          );
          if (props.isConfigured && !store.getters.onConfigChange) {
            store.dispatch("configChangeDetected");
          }
          selectedAuthClientId.value = "";
          selectedAuthClientSecret.value = "";
          selectedAuthenticationType.value = "";
          selectedAuthRedirectUrl.value = "";
        } else {
          selectedAuthClientIdError.value = true;
          errorMessage.value = "Login type already added";
        }
      } else {
        selectedAuthClientIdError.value = true;
        errorMessage.value = "Enter all details to continue";
      }
    }

    function removeAuthentication(index) {
      authToRemove.push(authenticationDetails.value[index].type.toLowerCase());
      store.dispatch(env.value + "/updateAuthToRemove", authToRemove);
      authenticationDetails.value.splice(index, 1);
      store.dispatch(
        env.value + "/updateAuthDetails",
        authenticationDetails.value
      );
      if (props.isConfigured && !store.getters.onConfigChange) {
        store.dispatch("configChangeDetected");
      }
    }

    //Resetting all reactive variables
    function clearAuthentication() {
      selectedAuthClientIdError.value = false;
      selectedAuthenticationType.value = "";
      selectedAuthClientId.value = "";
      selectedAuthClientSecret.value = "";
      selectedAuthRedirectUrl.value = "";
    }

    function getAuthTooltip({ authType, clientId, clientSecret, redirectUrl }) {
      let tooltip = `${authType} | ${clientId}`;
      if (clientSecret) {
        tooltip += ` | ${clientSecret}`;
      }
      if (redirectUrl) {
        tooltip += ` | ${redirectUrl}`;
      }
      return tooltip;
    }

    function onLearnMoreClicked() {
      store.dispatch("showLearnMorePopup", {
        header: "LOGIN TYPE",
        description:
          "Choose how your users signup/login to your app. Options for Signup/Login include popular oAuth mechanisms and once the uses any mechanism to enter your app, they will be assigned a public-private keypair which is then used as the basis for signing transactions as well as encrypting/decrypting data being uploaded/downloaded (both managed by the SDK). In the near future, there will be options for users to bring their own keys and/or use from a variety of wallet options.",
      });
    }

    watch(
      () => env.value,
      () => {
        authenticationDetails.value = store.getters[env.value + "/authDetails"];
      }
    );

    return {
      authenticationTypes,
      PlusIcon,
      authenticationDetails,
      selectedAuthClientIdError,
      selectedAuthClientId,
      selectedAuthClientSecret,
      selectedAuthRedirectUrl,
      selectedAuthenticationType,
      errorMessage,
      CheckIcon,
      CancelIcon,
      addAuthentication,
      clearAuthentication,
      removeAuthentication,
      getAuthTooltip,
      onLearnMoreClicked,
    };
  },
};
</script>

<style scoped>
.auth-link {
  color: var(--primary);
}

.input-group * {
  box-shadow: unset;
}
</style>
