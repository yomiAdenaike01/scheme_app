const EventsManager = () => import("@/views/Admin/Events/EventsManager");
const UserManager = () => import("@/views/Admin/Users/UserManager");
const Comms = () => import("@/views/Comms/CommsManager");

export default [


  {
    path: "events",
    name: "events",
    component: EventsManager,
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

];
