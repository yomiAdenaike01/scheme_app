const EventsManager = () => import("@/views/Admin/Events/EventsManager");
const Analytics = () => import("@/views/Admin/Analytics/AnalyticsManager");
const UserManager = () => import("@/views/Admin/Users/UserManager");
const Utilities = () => import("@/views/Admin/Utilities/UtilitiesManager");
const Integrations = () => import("@/views/Admin/Integrations/Integrations");
const Comms = () => import("@/views/Comms/CommsManager");

export default [
  {
    path: "utilities",
    name: "utilities",
    component: Utilities,
    meta: {
      authRequired: true
    }
  },

  {
    path: "events",
    name: "events",
    component: EventsManager,
    meta: {
      authRequired: true
    }
  },
  {
    path: "analytics",
    name: "analytics",
    component: Analytics,
    meta: {
      authRequired: true
    }
  },
  {
    path: "user",
    name: "user",
    component: UserManager,
    meta: {
      authRequired: true
    }
  },
  {
    path: "messenger",
    name: "comms",
    component: Comms,
    meta: {
      authRequired: true
    }
  },
  {
    path: "integrations",
    name: "integrations",
    component: Integrations,
    meta: {
      authRequired: true
    }
  }
];
