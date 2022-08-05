import 'vue-router'
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare global {
  interface Window {
    transactionSigner: {
      create: (data: any) => (data: any) => Promise<string>
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
