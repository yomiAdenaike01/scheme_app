import vars from "@/assets/_vars.scss";
export default {
  theme: localStorage.getItem("cssText"),
  serverHealth: {},
  requestIntervals: {
    team: 6000,
    shifts: 6000,
    client: 4000
  },
  clientInformation: localStorage.getItem("clientInformation")
    ? JSON.parse(localStorage.getItem("clientInformation"))
    : {},
  environmentURL:
    process.env.NODE_ENV == "development"
      ? "http://localhost:7070/"
      : "https://schemeapi.now.sh/",
  token: localStorage.getItem("token"),
  currentUser: localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : {},
  globalLoader: false,
  notifications: [],
  criticalNetworkError: false,
  weeklyTimesheetUploaded: false,
  hasSeenNotifications: false,

  localSettings: {
    general: {
      liveSchedule: true,
      liveNotifications: true,
      liveDashboard: true,
      notificationAlerts: true
    },
    security: {},
    colours: {
      sidebar: vars.default
    }
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
