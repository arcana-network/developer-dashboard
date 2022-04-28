<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

import CheckIcon from '@/assets/iconography/check.svg'
import CancelIcon from '@/assets/iconography/close.svg'
import VButton from '@/components/lib/VButton/VButton.vue'
import VCard from '@/components/lib/VCard/VCard.vue'
import VChip from '@/components/lib/VChip/VChip.vue'
import VDropdown from '@/components/lib/VDropdown/VDropdown.vue'
import VIconButton from '@/components/lib/VIconButton/VIconButton.vue'
import VSwitch from '@/components/lib/VSwitch/VSwitch.vue'
import VTextField from '@/components/lib/VTextField/VTextField.vue'
import VTooltip from '@/components/lib/VTooltip/VTooltip.vue'

const props = defineProps({
  isConfigured: Boolean,
})

const store = useStore()
let authToRemove = []
const authenticationTypes = [
  {
    name: 'Google',
    idRequired: true,
    setup: 'https://developers.google.com/identity/sign-in/web/sign-in',
  },
  {
    name: 'GitHub',
    idRequired: true,
    secretRequired: true,
    setup:
      'https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app',
  },
  {
    name: 'Reddit',
    idRequired: true,
    setup: 'https://github.com/reddit-archive/reddit/wiki/OAuth2',
    additionalSteps: 'Select installed app to get proper client id',
  },
  {
    name: 'Discord',
    idRequired: true,
    setup: 'https://canary.discord.com/developers/applications',
  },
  {
    name: 'Twitter',
    idRequired: true,
    secretRequired: true,
    redirectUrlRequired: true,
    idName: 'API Key',
    idSecret: 'API Secret',
    setup: 'https://developer.twitter.com/en/docs/apps/overview',
  },
  {
    name: 'Twitch',
    idRequired: true,
    setup: 'https://dev.twitch.tv/docs/authentication#registration',
  },
  {
    name: 'Passwordless',
    originRequired: true,
    redirectUrlRequired: true,
  },
]

const env = computed(() => {
  return store.getters.env
})

let authenticationDetails = ref([...store.getters[env.value + '/authDetails']])

let selectedAuthClientIdError = ref(false)
let selectedAuthenticationType = ref('')
let selectedAuthClientId = ref('')
let selectedAuthClientSecret = ref('')
let selectedAuthOrigin = ref('')
let selectedAuthRedirectUrl = ref('')
let errorMessage = ref('')
let hasAggregateLogin = computed(() => store.getters['test/hasAggregateLogin'])

function addAuthentication() {
  const type = selectedAuthenticationType.value.name.toLowerCase()
  if (
    authenticationDetails.value.find(
      (authDetail) => authDetail.type === type.toLowerCase()
    )
  ) {
    selectedAuthClientIdError.value = true
    errorMessage.value = 'Login type already added'
    return
  }

  const isIdMissing =
    selectedAuthenticationType.value.idRequired &&
    !selectedAuthClientId.value.trim()
  const isSecretMissing =
    selectedAuthenticationType.value.secretRequired &&
    !selectedAuthClientSecret.value.trim()
  const isOriginMissing =
    selectedAuthenticationType.value.originRequired &&
    !selectedAuthOrigin.value.trim()
  const isRedirectUrlMissing =
    selectedAuthenticationType.value.redirectUrlRequired &&
    !selectedAuthRedirectUrl.value.trim()
  if (
    isIdMissing ||
    isSecretMissing ||
    isOriginMissing ||
    isRedirectUrlMissing
  ) {
    selectedAuthClientIdError.value = true
    errorMessage.value = 'Enter all details to continue'
    return
  }

  if (authToRemove.includes(type)) {
    authToRemove.splice(authToRemove.indexOf(type), 1)
    store.dispatch(env.value + '/updateAuthToRemove', authToRemove)
  }

  authenticationDetails.value.push({
    type,
    verifier: type,
    authType: type,
    clientId: selectedAuthenticationType.value.idRequired
      ? selectedAuthClientId.value.trim()
      : undefined,
    clientSecret: selectedAuthenticationType.value.secretRequired
      ? selectedAuthClientSecret.value.trim()
      : undefined,
    origin: selectedAuthenticationType.value.originRequired
      ? selectedAuthOrigin.value.trim()
      : undefined,
    redirectUrl: selectedAuthenticationType.value.redirectUrlRequired
      ? selectedAuthRedirectUrl.value.trim()
      : undefined,
  })

  store.dispatch(env.value + '/updateAuthDetails', authenticationDetails.value)

  if (props.isConfigured && !store.getters.onConfigChange) {
    store.dispatch('configChangeDetected')
  }

  clearAuthentication()
}

function removeAuthentication(index) {
  authToRemove.push(authenticationDetails.value[index].type.toLowerCase())
  store.dispatch(env.value + '/updateAuthToRemove', authToRemove)
  authenticationDetails.value.splice(index, 1)
  store.dispatch(env.value + '/updateAuthDetails', authenticationDetails.value)
  if (props.isConfigured && !store.getters.onConfigChange) {
    store.dispatch('configChangeDetected')
  }
}

function clearAuthentication() {
  selectedAuthClientId.value = ''
  selectedAuthClientIdError.value = false
  selectedAuthClientSecret.value = ''
  selectedAuthenticationType.value = ''
  selectedAuthOrigin.value = ''
  selectedAuthRedirectUrl.value = ''
}

function getAuthTooltip({
  authType,
  clientId,
  clientSecret,
  origin,
  redirectUrl,
}) {
  let tooltip = `${authType} | ${
    authType === 'passwordless' ? origin : clientId
  }`
  if (clientSecret) {
    tooltip += ` | ${clientSecret}`
  }
  if (redirectUrl) {
    tooltip += ` | ${redirectUrl}`
  }
  return tooltip
}

function onLearnMoreClicked() {
  store.dispatch('showLearnMorePopup', {
    header: 'LOGIN TYPE',
    description:
      'Choose how your users signup/login to your app. Options for Signup/Login include popular oAuth mechanisms and once the uses any mechanism to enter your app, they will be assigned a public-private keypair which is then used as the basis for signing transactions as well as encrypting/decrypting data being uploaded/downloaded (both managed by the SDK). In the near future, there will be options for users to bring their own keys and/or use from a variety of wallet options.',
  })
}

function updateAggregateLogin(ev) {
  store.dispatch('test/updateAggregateLogin', ev.value)
}
</script>

<template>
  <v-card
    :id="'configure-step-' + 4"
    style="gap: 1.2em; padding: 1.5em 2em; margin-top: 2em"
    class="column"
  >
    <h4 style="display: block; width: 100%">CHOOSE LOGIN TYPE</h4>
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
        <div class="flex" style="gap: 0.625rem">
          <span
            class="body-1"
            style="font-family: var(--font-title); color: var(--text-grey)"
          >
            Aggregate Login
          </span>
          <v-switch
            :value="hasAggregateLogin"
            :disabled="isConfigured"
            style="margin-top: 1px"
            @checked="updateAggregateLogin"
          ></v-switch>
          <v-tooltip title="Aggregate Login (Needs content here)">
            <img
              src="@/assets/iconography/info-circle-outline.svg"
              style="cursor: pointer"
            />
          </v-tooltip>
        </div>
        <div class="flex input-group" style="margin-top: 1rem">
          <v-dropdown
            v-model="selectedAuthenticationType"
            :options="authenticationTypes"
            display-field="name"
            placeholder="Auth Type"
            style="min-width: 160px"
          />
          <v-text-field
            v-if="selectedAuthenticationType?.idRequired"
            v-model="selectedAuthClientId"
            :placeholder="
              selectedAuthenticationType.idName
                ? 'Enter ' + selectedAuthenticationType.idName
                : 'Enter Client ID'
            "
            :message-type="selectedAuthClientIdError ? 'error' : ''"
            :message="errorMessage"
          />
          <v-text-field
            v-if="selectedAuthenticationType?.secretRequired"
            v-model="selectedAuthClientSecret"
            :placeholder="
              selectedAuthenticationType.idSecret
                ? 'Enter ' + selectedAuthenticationType.idSecret
                : 'Enter Client Secret'
            "
            @keyup.enter="addAuthentication"
          />
          <v-text-field
            v-if="selectedAuthenticationType?.originRequired"
            v-model="selectedAuthOrigin"
            placeholder="Enter Origin"
          />
          <v-text-field
            v-if="selectedAuthenticationType?.redirectUrlRequired"
            v-model="selectedAuthRedirectUrl"
            placeholder="Enter Redirect Url"
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
          v-if="selectedAuthenticationType?.setup"
          class="overflow-x-hidden overflow-ellipsis"
        >
          <span class="body-2" style="line-height: 1.5">
            To get the required credentials visit
            <br />
            <a
              :href="selectedAuthenticationType.setup"
              target="__blank"
              class="auth-link"
              style="
                font-size: 1em;
                font-weight: 400;
                letter-spacing: 0.5px;
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
              style="
                max-width: 240px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
              @cancel="removeAuthentication(index)"
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

<style scoped>
.auth-link {
  color: var(--primary);
}

.input-group {
  gap: 1rem;
}
</style>
