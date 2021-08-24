import { createWebHistory, createRouter } from "vue-router";
// import store from "../store";

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

const routes = [
  {
    name: "Signup",
    path: "/signup",
    component: AppSignup,
  },
  {
    name: "Signup Success",
    path: "/signup/success",
    component: AppSignupSuccess,
  },
  {
    name: "Signin",
    path: "/signin",
    component: AppSignin,
  },
  {
    name: "Dashboard",
    path: "/",
    component: AppDashboard,
  },
  {
    name: "Forgot Password",
    path: "/password/forgot",
    component: AppForgotPassword,
  },
  {
    name: "Forgot Password Verify",
    path: "/password/forgot/verify",
    component: AppForgotPasswordVerify,
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
    name: "Create New Password",
    path: "/password/create",
    component: AppNewPassword,
  },
  //   {
  //     name: "/",
  //     redirect: "/login",
  //   },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// router.beforeEach((to, from, next) => {
//   if (to.name !== "Login") {
//     if (!store.getters.publicKey || !store.getters.privateKey) {
//       store.dispatch("updateRedirect", to);
//       router.replace({ name: "Login" });
//     }
//   }
//   return next();
// });

export default router;
