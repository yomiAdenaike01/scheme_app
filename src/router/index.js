import Vue from "vue";
import VueRouter from "vue-router";
import store from "./../store";

const UserAuth = () => import("@/views/Auth/UserAuth");
const ClientAuth = () => import("@/views/Auth/ClientAuth");
const dashboard = () => import("@/views/Admin/Dashboard/Dashboard");
const schedule = () => import("@/views/Admin/Schedule/Schedule");
const messenger = () => import("@/views/Comms/Messenger");
const reports = () => import("@/views/Admin/Reports/Reports");
const user = () => import("@/views/Admin/User/User");
// const featurerequest = () => import("@/views/Admin/FeatureRequest");

// Router views
const mainApp = () => import("@/views/router_views/Main");
const admin = () => import("@/views/router_views/Admin");
const comms = () => import("@/views/router_views/Comms");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "login" }
  },
  {
    path: "/main",
    name: "main",
    component: mainApp,
    children: [
      {
        path: "/admin",
        name: "admin",
        component: admin,
        children: [
          {
            path: "dashboard",
            name: "dashboard",
            component: dashboard,
            meta: {
              title: "Dashboard",
              authRequired: true
            }
          },
          {
            path: "schedule",
            name: "schedule",
            component: schedule,
            meta: {
              title: "Schedule",
              authRequired: true
            }
          },
          {
            path: "reports",
            name: "reports",
            component: reports,
            meta: {
              title: "Reports",
              authRequired: true
            }
          },
          {
            path: "user",
            name: "user",
            component: user,
            meta: {
              title: "User Management",
              authRequired: true
            }
          }
          // {
          //   path: "/request",
          //   component: featurerequest,
          //   meta: {
          //     title: "Feature Request / Bug Reporting",
          //     authRequired: true
          //   }
          // }
        ]
      },
      {
        path: "/comms",
        name: "comms",
        component: comms,
        children: [
          {
            path: "messenger",
            name: "messenger",
            component: messenger,
            meta: {
              title: "Messenger",
              authRequired: true
            }
          }
        ]
      }
    ]
  },
  {
    path: "/auth/user",
    name: "login",
    component: UserAuth,
    meta: {
      title: "User Authentication"
    }
  },
  {
    path: "/auth/client",
    name: "register",
    component: ClientAuth,
    meta: {
      title: "Client Authentication"
    }
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some(route => route.meta.authRequired);
  const isLoggedIn = Object.keys(store.state.currentUser).length > 0;
  let { hostname } = window.location;
  hostname = hostname.split(".")[0];

  document.title = `${to.meta.title} ${hostname}- powered by scheme`;

  if (authRequired) {
    if (!isLoggedIn) {
      next({
        name: "login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
