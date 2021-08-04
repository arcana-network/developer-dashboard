import { createWebHistory, createRouter } from "vue-router";
import store from "../store";

// const AppLogin = () => import("@/pages/AppLogin.vue");
// const MyFiles = () => import("@/pages/MyFiles.vue");
// const SharedWithMe = () => import("@/pages/SharedWithMe.vue");
// const TrashBin = () => import("@/pages/TrashBin.vue");

const routes = [
  //   {
  //     name: "My Files",
  //     path: "/my-files",
  //     component: MyFiles,
  //   },
  //   {
  //     name: "Shared With Me",
  //     path: "/shared-with-me",
  //     component: SharedWithMe,
  //   },
  //   {
  //     name: "Bin",
  //     path: "/bin",
  //     component: TrashBin,
  //   },
  //   {
  //     name: "Login",
  //     path: "/login",
  //     component: AppLogin,
  //   },
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
