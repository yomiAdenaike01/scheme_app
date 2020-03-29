const Error = () => import("@/views/Support/Error");
const ReleaseNotes = () => import("@/views/Support/ReleaseNotes");
export default [
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
];
