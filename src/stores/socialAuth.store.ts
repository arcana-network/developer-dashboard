import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { set } from 'vue-gtag'

import { updateApp, deleteCred } from '@/services/gateway.service'
import type {
  AppConfig,
  SocialAuthState as SocialAuthOptions,
} from '@/stores/apps.store'
import type {
  SocialAuthOption,
  SocialAuthVerifier,
  Network,
} from '@/utils/constants'

type AuthType = 'iam' | 'social'
type SocialAuthState = Array<SocialAuthOption>
type IAMAuthProviders = Array<SocialAuthOption>
type SocialAuthCredentialsInput = {
  [authType in AuthType]: {
    [verifier in SocialAuthVerifier]: {
      clientId: string
      clientSecret: string
    }
  }
}

type State = {
  socialAuthProviders: SocialAuthState
  iamAuthProviders: IAMAuthProviders
  authCredentialsInput: SocialAuthCredentialsInput | unknown
}

const useSocialAuthStore = defineStore('socialAuth', {
  state: (): State => ({
    socialAuthProviders: [],
    iamAuthProviders: [],
    authCredentialsInput: {},
  }),
  getters: {
    SocialAuthProviders(): SocialAuthState {
      return this.socialAuthProviders
    },
    IAMAuthProviders(): IAMAuthProviders {
      return this.iamAuthProviders
    },
  },
  actions: {
    setSocialAuthProviders(socialAuthProviders: SocialAuthState) {
      this.socialAuthProviders = socialAuthProviders
      this.authCredentialsInput['social'] = {}
      socialAuthProviders.forEach((authProvider) => {
        this.authCredentialsInput.social[authProvider.verifier] = {
          clientId: authProvider.clientId,
          clientSecret: authProvider.clientSecret,
          privateKey: authProvider.privateKey,
          teamId: authProvider.teamId,
          keyId: authProvider.keyId,
        }
      })
    },
    setIAMAuthProviders(iamAuthProviders: IAMAuthProviders) {
      this.iamAuthProviders = iamAuthProviders
      this.authCredentialsInput['iam'] = {}
      iamAuthProviders.forEach((authProvider) => {
        this.authCredentialsInput.iam[authProvider.verifier] = {
          clientId: authProvider.clientId,
          clientSecret: authProvider.clientSecret,
        }
      })
    },
    setClientId(
      type: AuthType,
      verifier: SocialAuthVerifier,
      clientId: string
    ) {
      this.authCredentialsInput[type][verifier].clientId = clientId
    },
    setClientSecret(
      type: AuthType,
      verifier: SocialAuthVerifier,
      clientSecret: string
    ) {
      this.authCredentialsInput[type][verifier].clientSecret = clientSecret
    },
    setTeamId(type: AuthType, verifier: SocialAuthVerifier, teamId: string) {
      this.authCredentialsInput[type][verifier].teamId = teamId
      this.setAppleClientSecret(type, verifier)
    },
    setKeyId(type: AuthType, verifier: SocialAuthVerifier, keyId: string) {
      this.authCredentialsInput[type][verifier].keyId = keyId
      this.setAppleClientSecret(type, verifier)
    },
    setPrivateKey(
      type: AuthType,
      verifier: SocialAuthVerifier,
      privateKey: string
    ) {
      this.authCredentialsInput[type][verifier].privateKey = privateKey
      this.setAppleClientSecret(type, verifier)
    },
    setAppleClientSecret(type: AuthType, verifier: SocialAuthVerifier) {
      if (verifier === 'apple') {
        const appleClientSecret = [
          this.authCredentialsInput[type][verifier].teamId,
          this.authCredentialsInput[type][verifier].keyId,
          this.authCredentialsInput[type][verifier].privateKey,
        ].join(':')
        this.authCredentialsInput[type][verifier].clientSecret =
          JSON.stringify(appleClientSecret)
      }
    },
    async updateSocialAuthProviders(
      appId: number,
      authType: AuthType,
      app: AppConfig
    ) {
      const { auth, network } = app

      const inputs = { ...this.authCredentialsInput[authType] }

      const payload = toRaw(auth.social).map((a) => {
        if (inputs[a.verifier]) {
          const credObj = {
            ...a,
            clientId: inputs[a.verifier].clientId,
            clientSecret: inputs[a.verifier].clientSecret,
          }
          console.log('credObj', credObj)
          delete inputs[a.verifier]
          return credObj
        } else return a
      })

      const newCreds = Object.keys(inputs)
        .map((k) => {
          return {
            ...inputs[k],
            verifier: k as SocialAuthVerifier,
          }
        })
        .filter((cred) => cred.clientId)

      auth.social = [...payload, ...newCreds]
      const authToRemove = auth.social.filter((input) => input.clientId === '')
      await updateApp(appId, { auth }, network)
      await this.deleteSocialAuthProviders(appId, authToRemove, network)
    },
    async deleteSocialAuthProviders(
      appId: number,
      authToRemove: SocialAuthOptions[],
      network: Network
    ) {
      await deleteCred(appId, authToRemove, network)
    },
  },
})

export { useSocialAuthStore }
