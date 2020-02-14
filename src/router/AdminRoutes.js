const Dashboard = () => import("@/views/Admin/Dashboard/Dashboard");
const Schedule = () => import("@/views/Admin/Schedule/Schedule");
const Reports = () => import("@/views/Admin/Reports/Reports");
const UserManager = () => import("@/views/Admin/User/UserManager");
const Utilities = () => import("@/views/Admin/Utilities/Utilities");
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
    path: "dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      authRequired: true
    }
  },
  {
    path: "schedule",
    name: "schedule",
    component: Schedule,
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
