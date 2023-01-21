import 'vue-router'
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare global {
  import type { DelegatePermission } from '@/stores/apps.store'
  import type {
    TransactionSignerParams,
    SmartContractAcceptedValue,
  } from '@/utils/signerUtils'

  type DelegatorParams = {
    appAddress: string
    gateway: string
    forwarderAddress: string
    accessToken: string
    provider: any
    delegator: string
    roles: DelegatePermission[]
  }

  interface ImportMetaEnv {
    PROD: boolean

    VITE_IS_APP_DOWN?: boolean

    VITE_ARCANA_APP_ADDRESS: string
    VITE_ARCANA_AUTH_NETWORK: 'dev' | 'testnet'
    VITE_ARCANA_DOCS_URL: string
    VITE_ARCANA_GATEWAY_API_VERSION: string
    VITE_ARCANA_GATEWAY_TESTNET_URL: string
    VITE_ARCANA_GATEWAY_MAINNET_URL: string
    VITE_ARCANA_VERIFY_URL: string

    VITE_GOOGLE_ANALYTICS_ID?: string

    VITE_MAILCHIMP_DEV_PORTAL_ID?: string
    VITE_MAILCHIMP_GROUP?: string
    VITE_MAILCHIMP_LIST_ID?: string
    VITE_MAILCHIMP_LIST_URL?: string
    VITE_MAILCHIMP_USER_ID?: string

    VITE_SENTRY_DSN: string
    VITE_SENTRY_TRACING_ORIGINS: string
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface Window {
    transactionSigner: {
      createTransactionSigner: (
        data: TransactionSignerParams
      ) => (
        method: string,
        value?: SmartContractAcceptedValue
      ) => Promise<string>
      generateLoginInfo: (data: { provider: any; gateway: string }) => Promise<{
        nonce: number
        signature: string
        address: string
      }>
      hashJson: (data: any) => string
      delegator: {
        grant: (data: DelegatorParams) => Promise<string>
        revoke: (data: Omit<DelegatorParams, 'roles'>) => Promise<string>
      }
    }
    arcana: {
      provider: any
    }
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

export {}
