import storage from "./storage";
import vars from "@/assets/element-variables.scss";
export default {
  theme: localStorage.getItem("cssText"),
  client: {},
  environmentURL:
    process.env.NODE_ENV == "development"
      ? "http://localhost:7070/"
      : "https://schemeapi.now.sh/",
  token: storage.get("token"),
  currentUser: storage.get("currentUser")
    ? JSON.parse(storage.get("currentUser"))
    : {},
  globalLoader: false,
  notifications: [],
  critical_network_error: false,
  weeklyTimesheetUploaded: false,
  hasSeenNotifications: false,

  localSettings: {
    general: {
      live_schedule: true,
      live_notifications: true,
      live_dashboard: true,
      notifications: true
    },
    security: {},
    colours: {}
  },
  viewNotificationsCenter: false,
  userNotifications: [],
  currentInterval: "",
  viewMobileMenu: false,
  defaultSize: { minFontSize: "10px", maxFontSize: "16px" },
  intervals: {
    clientInterval: null
  }
};
