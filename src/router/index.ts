import {
  createWebHistory,
  createRouter,
  type Router,
  type RouteRecordRaw,
} from 'vue-router'

import { useAppsStore } from '@/stores/apps.store'
import { useAuthStore } from '@/stores/auth.store'
import constants from '@/utils/constants'

const authStore = useAuthStore()
const appsStore = useAppsStore()

const AppDashboard = () => import('@/pages/AppDashboard.vue')
const AppProfile = () => import('@/pages/AppProfile.vue')
const AppInvoices = () => import('@/pages/AppInvoices.vue')
const AppLogin = () => import('@/pages/AppLogin.vue')
const AppDownNotification = () => import('@/pages/AppDownNotification.vue')
const ManageApps = () => import('@/pages/ManageApps.vue')
const AppDetails = () => import('@/pages/AppDetails.vue')

const AuthSettings = () =>
  import('@/components/app-configure/auth/AuthSettings.vue')
const WebWallet = () => import('@/components/app-configure/auth/WebWallet.vue')
const AppBranding = () =>
  import('@/components/app-configure/general/AppBranding.vue')
const AppKeyspace = () => import('@/components/app-configure/AppKeyspace.vue')

function toBoolean(val: string | boolean | number): boolean {
  if (typeof val === 'string') {
    if (val === '0' || val === 'false') {
      return false
    }
  }
  return !!val
}

const routes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    redirect: '/apps',
  },
  {
    name: 'Signup',
    path: '/signup',
    redirect: '/login',
  },
  {
    name: 'Signin',
    path: '/signin',
    redirect: '/login',
  },
  {
    name: 'ManageApps',
    path: '/apps',
    component: ManageApps,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'AppDetails',
    path: '/apps/:appId',
    component: AppDetails,
    redirect: { name: 'Dashboard' },
    children: [
      {
        name: 'Dashboard',
        path: 'dashboard',
        component: AppDashboard,
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'Branding',
        path: 'configure/branding',
        component: AppBranding,
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'Social Auth',
        path: 'configure/social',
        component: AuthSettings,
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'Arcana Wallet',
        path: 'configure/wallet',
        component: WebWallet,
        meta: {
          requiresAuth: true,
        },
      },
      {
        name: 'Keyspace',
        path: 'configure/keyspace',
        component: AppKeyspace,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    name: 'AppProfile',
    path: '/profile',
    component: AppProfile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'Invoices',
    path: '/invoices',
    component: AppInvoices,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'Login',
    path: '/login',
    component: AppLogin,
  },
  {
    name: 'AppDown',
    path: '/under-maintenance',
    component: AppDownNotification,
  },
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  if (to.name === 'AppDown' && !toBoolean(constants.isAppDown)) {
    router.push({
      name: 'Login',
    })
  }
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !authStore.accessToken.testnet
  ) {
    router.push({
      name: 'Login',
      params: { redirectTo: String(to.name), ...to.params },
    })
  } else if (to.name === 'Login' && authStore.accessToken.testnet) {
    router.push({ name: 'ManageApps' })
  }
  return next()
})

export default router
