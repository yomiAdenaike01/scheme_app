// sub views
const UserAuth = () => import("@/views/Auth/UserAuth");
const ClientAuth = () => import("@/views/Auth/ClientAuth");

export default [
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