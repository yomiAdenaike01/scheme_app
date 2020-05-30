import Vue from "vue";
import VueRouter from "vue-router";
import store from "./../store";

// Router modules
const Common = () => import("@/modules/common/Common");
const Support = () => import("@/modules/support/Support");
// Auth
const SignIn = () => import("@/modules/authorisation/SignIn");
// Common
const Events = () => import("@/modules/events/Events");
const Requests = () => import("@/modules/requests/Requests");

const Team = () => import("@/modules/team/Team");
const Comms = () => import("@/modules/comms/Comms");
const Tasks = () => import("@/modules/tasks/Tasks");
const Preferences = () => import("@/modules/preferences/Preferences");

// Support
const Error = () => import("@/modules/support/Error");
const ReleaseNotes = () => import("@/modules/support/ReleaseNotes");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "signIn" }
  },
  {
    path: "/signin",
    name: "signIn",
    component: SignIn
  },
  {
    path: "/support",
    name: "support",
    component: Support,
    children: [
      {
        path: "error",
        name: "error",
        component: Error
      },
      {
        path: "releasenotes",
        name: "releasenotes",
        component: ReleaseNotes
      }
    ]
  },
  {
    path: "/common",
    name: "common",
    component: Common,

    children: [
      {
        path: "events",
        name: "events",
        component: Events,
        meta: {
          authRequired: true
        }
      },
      {
        path: "requests",
        name: "requests",
        component: Requests,
        meta: {
          authRequired: true
        }
      },
      {
        path: "team",
        name: "team",
        component: Team,
        meta: {
          authRequired: true
        }
      },
      {
        path: "comms",
        name: "comms",
        component: Comms,
        meta: {
          authRequired: true
        }
      },
      {
        path: "preferences",
        name: "preferences",
        component: Preferences,
        meta: {
          authRequired: true
        }
      },
      {
        path: "tasks",
        name: "tasks",
        component: Tasks,
        meta: {
          authRequired: true
        }
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some(route => route.meta.authRequired);
  const isLoggedIn = Vue.prototype.hasEntries(store.state.userInformation);

  function redirect(name) {
    next({
      name,
      query: { redirect: to.fullPath }
    });
  }

  if (authRequired) {
    if (!isLoggedIn) {
      redirect("signIn");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
