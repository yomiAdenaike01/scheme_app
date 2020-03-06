// Comms
const Messenger = () => import("@/views/Comms/Messenger");
export default [
  {
    path: "messenger",
    name: "messenger",
    component: Messenger,
    meta: {
      authRequired: true
    }
  }
];
