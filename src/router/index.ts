import {
  createWebHistory,
  createRouter,
  type Router,
  type RouteRecordRaw,
} from 'vue-router'

import store from '@/store'
import { useAuthStore } from '@/stores/auth.store'
import constants from '@/utils/constants'

const authStore = useAuthStore()

const AppDashboard = () => import('@/pages/AppDashboard.vue')
const AppConfigure = () => import('@/pages/AppConfigure.vue')
const AppProfile = () => import('@/pages/AppProfile.vue')
const AppUsers = () => import('@/pages/AppUsers.vue')
const AppLogin = () => import('@/pages/AppLogin.vue')
const AppDownNotification = () => import('@/pages/AppDownNotification.vue')

const GeneralSettings = () =>
  import('@/components/app-configure/general/GeneralSettings.vue')
const AuthSettings = () =>
  import('@/components/app-configure/auth/AuthSettings.vue')
const StoreSettings = () =>
  import('@/components/app-configure/store/StoreSettings.vue')
const AccessSettings = () =>
  import('@/components/app-configure/access/AccessSettings.vue')
const CreateApp = () => import('@/components/app-configure/CreateApp.vue')

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
    redirect: store.getters.appId ? '/app/dashboard' : '/app/create',
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
    path: '/app',
    redirect: store.getters.appId ? '/app/dashboard' : '/app/create',
  },
  {
    name: 'Dashboard',
    path: '/app/dashboard',
    component: AppDashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'Configure',
    path: '/app/configure',
    component: AppConfigure,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: '/app/configure/general',
      },
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
    name: 'CreateApp',
    path: '/app/create',
    component: CreateApp,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'Users',
    path: '/app/users',
    component: AppUsers,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'Profile',
    path: '/profile',
    component: AppProfile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: 'Login',
    path: '/login',
    component: toBoolean(constants.isAppDown) ? AppDownNotification : AppLogin,
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
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !authStore.accessToken
  ) {
    router.push({ name: 'Login', params: { redirectTo: String(to.name) } })
  } else if (to.name === 'Login' && authStore.accessToken) {
    router.push({ name: 'Dashboard' })
  } else if (
    to.path.includes('/app') &&
    to.name !== 'CreateApp' &&
    !store.getters.appId
  ) {
    router.push({ name: 'CreateApp' })
  } else if (to.name === 'CreateApp' && store.getters.appId) {
    router.push({ name: 'Dashboard' })
  }
  return next()
})

export default router
