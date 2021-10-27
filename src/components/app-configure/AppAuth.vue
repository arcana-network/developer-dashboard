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
        <v-button variant="link" label="LEARN MORE" />
      </div>
      <div class="flex column">
        <div
          class="flex sm-column flex-wrap"
          style="gap: 2em; align-items: flex-start; margin-bottom: 1em"
        >
          <v-dropdown
            :options="authenticationTypes"
            displayField="name"
            placeholder="Authentication Type"
            style="width: calc(36% - 4em); min-width: 260px"
            v-model="selectedAuthenticationType"
          />
        </div>
        <div
          class="flex sm-column flex-wrap"
          style="gap: 2em; align-items: flex-start"
        >
          <v-text-field
            v-if="selectedAuthenticationType"
            placeholder="Enter Client ID"
            v-model="selectedAuthClientId"
            :messageType="selectedAuthClientIdError ? 'error' : ''"
            :message="errorMessage"
          />
          <v-text-field
            v-if="
              selectedAuthenticationType &&
              selectedAuthenticationType.secretRequired
            "
            placeholder="Enter Client Secret"
            v-model="selectedAuthClientSecret"
            @keyup.enter="addAuthentication"
          />
          <v-text-field
            v-if="
              selectedAuthenticationType &&
              selectedAuthenticationType.redirectUrlRequired
            "
            placeholder="Enter Redirect Url"
            :icon="PlusIcon"
            v-model="selectedAuthRedirectUrl"
          />
          <!-- <v-card-button
            @click.stop="addAuthentication"
            v-if="selectedAuthenticationType"
            style="margin-top: 4px"
          >
            <img :src="PlusIcon" />
            <span style="margin-left: 1em">ADD</span>
          </v-card-button> -->
          <v-button
            variant="secondary"
            @click.stop="addAuthentication"
            v-if="selectedAuthenticationType"
            label="ADD"
          />
        </div>
        <div class="flex flex-wrap" style="gap: 2em">
          <v-tooltip
            v-for="(authDetail, index) in authenticationDetails"
            :key="authDetail"
            :title="`${authDetail.authType} | ${authDetail.clientId} | ${authDetail.redirectUrl}`"
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
                {{ authDetail.authType }} | {{ authDetail.clientId }} |
                {{ authDetail.redirectUrl }}
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
    const authenticationTypes = [
      // "Bring Your Own Keys",
      {
        name: "Google",
      },
      {
        name: "Github",
        secretRequired: true,
      },
      {
        name: "Reddit",
      },
      {
        name: "Discord",
      },
      {
        name: "Twitter",
        secretRequired: true,
        redirectUrlRequired: true,
      },
      {
        name: "Twitch",
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
      authenticationDetails.value.splice(index, 1);
      store.dispatch(
        env.value + "/updateAuthDetails",
        authenticationDetails.value
      );
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
      addAuthentication,
      removeAuthentication,
    };
  },
};
</script>

<style scoped>
</style>
