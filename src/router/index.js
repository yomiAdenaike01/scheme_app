import Vue from "vue";
import VueRouter from "vue-router";
import store from "./../store";

import AdminRoutes from "./AdminRoutes";
import AuthRoutes from "./AuthRoutes";
import SupportRoutes from "./SupportRoutes";

const ClientIntro = () => import("@/components/ClientIntro");

// Router views
const MainApp = () => import("@/views/router_views/Main");
const Admin = () => import("@/views/router_views/Admin");
const Support = () => import("@/views/router_views/Support");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "events" }
  },
  {
    path: "/intro",
    name: "clientIntro",
    component: ClientIntro
  },

  {
    path: "/support",
    name: "support",
    component: Support,
    children: [...SupportRoutes]
  },
  {
    path: "/main",
    name: "main",
    component: MainApp,
    children: [
      {
        path: "/admin",
        name: "admin",
        component: Admin,
        children: [...AdminRoutes]
      }
    ]
  },
  ...AuthRoutes
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some(route => route.meta.authRequired);
  const isLoggedIn = Vue.prototype.hasEntries(store.state.userInformation);
  let { hostname } = window.location;
  hostname = hostname.split(".")[0];
  document.title = `${hostname} - Powered By Schemeapp.cloud`;

  function redirect(name) {
    next({
      name,
      query: { redirect: to.fullPath }
    });
  }

  if (authRequired) {
    if (!isLoggedIn) {
      redirect("login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
