import Vue from "vue";
import VueRouter from "vue-router";
import store from "./../store";

const clientIntro = () => import("@/components/ClientIntro");


// Router views
const mainApp = () => import("@/views/router_views/Main");
const admin = () => import("@/views/router_views/Admin");
const comms = () => import("@/views/router_views/Comms");
const support = () => import("@/views/router_views/Support")

// sub views
const UserAuth = () => import("@/views/Auth/UserAuth");
const ClientAuth = () => import("@/views/Auth/ClientAuth");

const dashboard = () => import("@/views/Admin/Dashboard/Dashboard");
const schedule = () => import("@/views/Admin/Schedule/Schedule");
const reports = () => import("@/views/Admin/Reports/Reports");
const UserManagement = () => import("@/views/Admin/User/UserManagement");
const utilities = () => import("@/views/Admin/Utilities/Utilities");

// Comms
const messenger = () => import("@/views/Comms/Messenger");

// Support
const faqs = () => import("@/views/Support/FAQs");
const error = () => import("@/views/Support/CriticalError");



Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "login" }
  },
  {
    path: "/intro",
    name: "clientIntro",
    component: clientIntro
  },
 
  {
    path: "/support",
    name: "support",
    component: support,
    children: [
      {
        path: "error",
        name: "error",
        component: error
      },
      {
        path: "faqs",
        name: "faqs",
        component: faqs
      }
    ]
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
            path: "utilities",
            name: "utilities",
            component: utilities,
            meta: {
              authRequired: true
            }
          },
          {
            path: "dashboard",
            name: "dashboard",
            component: dashboard,
            meta: {
              authRequired: true
            }
          },
          {
            path: "schedule",
            name: "schedule",
            component: schedule,
            meta: {
              authRequired: true
            }
          },
          {
            path: "reports",
            name: "reports",
            component: reports,
            meta: {
              authRequired: true
            }
          },
          {
            path: "user",
            name: "user",
            component: UserManagement,
            meta: {
              authRequired: true
            }
          }
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
    component: UserAuth
  },
  {
    path: "/auth/client",
    name: "register",
    component: ClientAuth
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some(route => route.meta.authRequired);
  const isLoggedIn = Object.keys(store.state.userInformation).length > 0;
  let { hostname } = window.location;
  hostname = hostname.split(".")[0];
  document.title = `${hostname} - Powered By Schemeapp.cloud`;

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
