const EventsModule = () => import("@/views/Admin/Events/EventsModule");
const UserModule = () => import("@/views/Admin/Users/UserModule");
const Comms = () => import("@/views/Comms/CommsModule");
const Tasks = () => import("@/views/Admin/Tasks/Tasks");
export default [
  {
    path: "events",
    name: "events",
    component: EventsModule,
    meta: {
      authRequired: true
    }
  },

  {
    path: "user",
    name: "user",
    component: UserModule,
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
    path: "tasks",
    name: "tasks",
    component: Tasks,
    meta: {
      authRequired: true
    }
  }
];
