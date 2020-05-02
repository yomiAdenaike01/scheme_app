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
const Team = () => import("@/modules/team/Team");
const Comms = () => import("@/modules/comms/Comms");
const Tasks = () => import("@/modules/tasks/Tasks");
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
    path: "/main",
    name: "main",
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
        path: "user",
        name: "user",
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
