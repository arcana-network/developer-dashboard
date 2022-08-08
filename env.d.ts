import 'vue-router'
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare global {
  type SmartContractAcceptedValue = (string | undefined | number)[]

  type TransactionSignerParams = {
    appAddress: string
    provider: any
    forwarderAddress: string
    gateway: string
    accessToken: string
  }

  interface ImportMeta {
    readonly env: any
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
