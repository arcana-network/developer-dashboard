import 'vue-router'
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare global {
  import type { ArcanaProvider } from '@arcana/auth'

  type SmartContractAcceptedValue = (string | undefined | number)[]

  type TransactionSignerParams = {
    appAddress: string
    provider: ArcanaProvider
    forwarderAddress: string
    gateway: string
    accessToken: string
  }

  interface ImportMetaEnv {
    PROD: boolean
    VITE_ARCANA_APP_ID: string
    VITE_GATEWAY_API: string
    VITE_VERIFY_URI: string
    VITE_DOCS_URL: string
    VITE_CURRENT_API_VERSION: string
    VITE_ARCANA_AUTH_NETWORK: 'dev' | 'testnet'
    VITE_GOOGLE_ANALYTICS_ID?: string
    VITE_IS_APP_DOWN?: boolean
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
      generateLoginInfo: (data: any) => Promise<any>
      hashJson: (data: any) => string
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
