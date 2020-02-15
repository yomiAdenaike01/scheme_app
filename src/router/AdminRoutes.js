const EventsManager = () => import("@/views/Admin/Events/EventsManager");
const Reports = () => import("@/views/Admin/Reports/ReportsManager");
const UserManager = () => import("@/views/Admin/Users/UserManager");
const Utilities = () => import("@/views/Admin/Utilities/UtilitiesManager");
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
    path: "reports",
    name: "reports",
    component: Reports,
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
  }
];
