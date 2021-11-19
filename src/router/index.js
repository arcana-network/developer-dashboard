import { createWebHistory, createRouter } from "vue-router";
import store from "../store";
import { isAppDown } from "../utils/constants";

const AppSignup = () => import("../pages/AppSignup.vue");
const AppSignin = () => import("../pages/AppSignin.vue");
const AppDashboard = () => import("../pages/AppDashboard.vue");
const AppSignupSuccess = () => import("../pages/AppSignupSuccess.vue");
const AppForgotPassword = () => import("../pages/AppForgotPassword.vue");
const AppForgotPasswordVerify = () =>
  import("../pages/AppForgotPasswordVerify.vue");
const AppConfigure = () => import("../pages/AppConfigure.vue");
const AppProfile = () => import("../pages/AppProfile.vue");
const AppNewPassword = () => import("../pages/AppNewPassword.vue");
const AppUsers = () => import("../pages/AppUsers.vue");
const AppLoginV2 = () => import("../pages/AppLoginV2.vue");
const SSORedirect = () => import("../pages/SSORedirect.vue");
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
    // component: AppSignup,
    redirect: "/login",
  },
  // {
  //   name: "Signup Success",
  //   path: "/signup/success",
  //   component: AppSignupSuccess,
  // },
  {
    name: "Signin",
    path: "/signin",
    // component: AppSignin,
    redirect: "/login",
  },
  {
    name: "Dashboard",
    path: "/",
    component: AppDashboard,
  },
  // {
  //   name: "Forgot Password",
  //   path: "/password/forgot",
  //   component: AppForgotPassword,
  // },
  // {
  //   name: "Forgot Password Verify",
  //   path: "/password/forgot/verify",
  //   component: AppForgotPasswordVerify,
  // },
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
  // {
  //   name: "Create New Password",
  //   path: "/password/create",
  //   component: AppNewPassword,
  // },
  {
    name: "Login",
    path: "/login",
    component: toBoolean(isAppDown) ? AppDownNotification : AppLoginV2,
  },
  {
    name: "SSO Redirect",
    path: "/oauth/redirect",
    component: SSORedirect,
  },
  // {
  //   name: "*",
  //   redirect: "/404",
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

const openRoutes = ["SSO Redirect", "Login", "Signup", "Signin"];

router.beforeEach((to, from, next) => {
  if (!openRoutes.includes(to.name) && !store.getters.accessToken) {
    router.replace({ name: "Login" });
  } else if (to.name === "Login" && store.getters.accessToken) {
    router.push({ name: "Dashboard" });
  }
  return next();
});

export default router;
