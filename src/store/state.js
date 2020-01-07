import storage from "./storage";
export default {
  token: storage.get("token"),
  currentUser: storage.get("currentUser")
    ? JSON.parse(storage.get("currentUser"))
    : {},
  globalLoader: false,
  notifications: [],
  critical_network_error: false,
  localSettings: {
    general: {
      live_schedule: true,
      live_notifications: true,
      live_dashboard: true,
      notifications: true
    },
    security: {}
  },
  viewNotificationsCenter: false,
  userNotifications: [],
  currentInterval: "",
  viewMobileMenu: false,
  defaultSize: { minFontSize: "10px", maxFontSize: "16px" }
};
