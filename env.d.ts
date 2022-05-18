import 'vue-router'
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare global {
  import type { SmartContractRequestParams } from '@/utils/signerMakeTx'

  interface Window {
    signerMakeTx: (data: SmartContractRequestParams) => Promise<string>
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

export {}
