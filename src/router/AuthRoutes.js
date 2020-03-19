const UserAuth = () => import("@/views/Auth/UserAuth");

export default [
  {
    path: "/auth",
    name: "login",
    component: UserAuth
  }
 
];
