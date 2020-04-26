const EventsModule = () => import("@/views/Admin/Events/EventsModule");
const UserModule = () => import("@/views/Admin/Users/UserModule");
const CommsModule = () => import("@/views/Comms/CommsModule");
const TasksModule = () => import("@/views/Admin/Tasks/TasksModule");

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
    path: "comms",
    name: "comms",
    component: CommsModule,
    meta: {
      authRequired: true
    }
  },
  {
    path: "tasks",
    name: "tasks",
    component: TasksModule,
    meta: {
      authRequired: true
    }
  }
];
