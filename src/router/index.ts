import {
  createWebHistory,
  createRouter,
  type Router,
  type RouteRecordRaw,
} from 'vue-router'

import { useAuthStore } from '@/stores/auth.store'
import constants from '@/utils/constants'

const authStore = useAuthStore()

const AppDashboard = () => import('@/pages/AppDashboard.vue')
const AppConfigure = () => import('@/pages/AppConfigure.vue')
const AppProfile = () => import('@/pages/AppProfile.vue')
const AppUsers = () => import('@/pages/AppUsers.vue')
const AppLogin = () => import('@/pages/AppLogin.vue')
const AppDownNotification = () => import('@/pages/AppDownNotification.vue')
const ManageApps = () => import('@/pages/ManageApps.vue')
const AppDetails = () => import('@/pages/AppDetails.vue')

const GeneralSettings = () =>
  import('@/components/app-configure/general/GeneralSettings.vue')
const AuthSettings = () =>
  import('@/components/app-configure/auth/AuthSettings.vue')
const StoreSettings = () =>
  import('@/components/app-configure/store/StoreSettings.vue')
const AccessSettings = () =>
  import('@/components/app-configure/access/AccessSettings.vue')

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
    props: true,
    meta: {
      requiresAuth: true,
      hasSidebar: true,
    },
    redirect: { name: 'Dashboard' },
    children: [
      {
        name: 'Dashboard',
        path: 'dashboard',
        component: AppDashboard,
      },
      {
        name: 'Configure',
        path: 'config',
        component: AppConfigure,
        props: true,
        redirect: { name: 'GeneralSettings' },
        children: [
          {
            name: 'GeneralSettings',
            path: 'general',
            component: GeneralSettings,
          },
          {
            name: 'AuthSettings',
            path: 'auth',
            component: AuthSettings,
          },
          {
            name: 'StoreSettings',
            path: 'store',
            component: StoreSettings,
          },
          {
            name: 'AccessSettings',
            path: 'access',
            component: AccessSettings,
          },
        ],
      },
      {
        name: 'Users',
        path: '/apps/:appId/users',
        component: AppUsers,
      },
    ],
  },
  {
    name: 'Profile',
    path: '/profile',
    component: AppProfile,
    meta: {
      requiresAuth: true,
      hasSidebar: true,
    },
  },
  {
    name: 'Login',
    path: '/login',
    component: toBoolean(constants.isAppDown) ? AppDownNotification : AppLogin,
    meta: {
      hasLandingDescriptor: !toBoolean(constants.isAppDown),
    },
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
  console.log('[VueRouter] To', to.meta, to.fullPath)
  console.log('[VueRouter] From', from.meta, from.fullPath)
  if (to.meta.requiresAuth && !authStore.accessToken) {
    router.push({
      name: 'Login',
      params: { redirectTo: String(to.name), ...to.params },
    })
  } else if (to.name === 'Login' && authStore.accessToken) {
    router.push({ name: 'ManageApps' })
  }
  return next()
})

export default router
