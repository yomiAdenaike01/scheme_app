// Support
const SupportCentre = () => import("@/views/Support/SupportManager");

const FAQs = () => import("@/views/Support/FAQs");
const CriticalError = () => import("@/views/Support/CriticalError");

export default [
  {
    path: "dashboard",
    name: "supportCentre",
    component: SupportCentre
  },
  {
    path: "error",
    name: "error",
    component: CriticalError
  },
  {
    path: "faqs",
    name: "faqs",
    component: FAQs
  }
];
