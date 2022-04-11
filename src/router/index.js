import { createWebHistory, createRouter } from "vue-router";
import store from "../store";
import { isAppDown } from "../utils/constants";

const AppDashboard = () => import("../pages/AppDashboard.vue");
const AppConfigure = () => import("../pages/AppConfigure.vue");
const AppProfile = () => import("../pages/AppProfile.vue");
const AppNewPassword = () => import("../pages/AppNewPassword.vue");
const AppUsers = () => import("../pages/AppUsers.vue");
const AppLogin = () => import("../pages/AppLogin.vue");
const AppDownNotification = () => import("../pages/AppDownNotification.vue");

function toBoolean(val) {
  if (typeof val === "string") {
    if (val === "0" || val === "false") {
      return false;
    }
  }
  return !!val;
}

const routes = [
  {
    name: "Signup",
    path: "/signup",
    redirect: "/login",
  },
  {
    name: "Signin",
    path: "/signin",
    redirect: "/login",
  },
  {
    name: "Dashboard",
    path: "/",
    component: AppDashboard,
  },
  {
    name: "Configure",
    path: "/configure",
    component: AppConfigure,
  },
  {
    name: "Users",
    path: "/users",
    component: AppUsers,
  },
  {
    name: "Profile",
    path: "/profile",
    component: AppProfile,
  },
  {
    name: "Create Password",
    path: "/password/create",
    component: AppNewPassword,
    props: true,
  },
  {
    name: "Login",
    path: "/login",
    component: toBoolean(isAppDown) ? AppDownNotification : AppLogin,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

const openRoutes = [
  "SSO Redirect",
  "Login",
  "Signup",
  "Signin",
  "Create Password",
];

router.beforeEach((to, from, next) => {
  if (!openRoutes.includes(to.name) && !store.getters.accessToken) {
    router.replace({ name: "Login" });
  } else if (to.name === "Login" && store.getters.accessToken) {
    router.push({ name: "Dashboard" });
  }
  return next();
});

export default router;
