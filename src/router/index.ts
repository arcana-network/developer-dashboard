import {
  createWebHistory,
  createRouter,
  type Router,
  type RouteRecordRaw,
} from 'vue-router'

import store from '@/store'
import constants from '@/utils/constants'

const AppDashboard = () => import('@/pages/AppDashboard.vue')
const AppConfigure = () => import('@/pages/AppConfigure.vue')
const AppProfile = () => import('@/pages/AppProfile.vue')
const AppNewPassword = () => import('@/pages/AppNewPassword.vue')
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
    name: 'Dashboard',
    path: '/',
    component: AppDashboard,
  },
  {
    name: 'Configure',
    path: '/configure',
    component: AppConfigure,
    children: [
      {
        path: '',
        redirect: '/configure/general',
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
    name: 'Users',
    path: '/users',
    component: AppUsers,
  },
  {
    name: 'Profile',
    path: '/profile',
    component: AppProfile,
  },
  {
    name: 'Create Password',
    path: '/password/create',
    component: AppNewPassword,
    props: true,
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

const openRoutes: string[] = [
  'SSO Redirect',
  'Login',
  'Signup',
  'Signin',
  'Create Password',
]

router.beforeEach((to, from, next) => {
  if (!openRoutes.includes(String(to.name)) && !store.getters.accessToken) {
    router.replace({ name: 'Login' })
  } else if (to.name === 'Login' && store.getters.accessToken) {
    router.push({ name: 'Dashboard' })
  }
  return next()
})

export default router
