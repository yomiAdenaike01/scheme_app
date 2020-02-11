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
  userInformation: localStorage.getItem("userInformation")
    ? JSON.parse(localStorage.getItem("userInformation"))
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
  },
  invalidClient: {
    display: false,
    isError: false
  },
  defaultCustomColours: [
    "rgba(42, 104, 212, 1)",
    "#ff4500",
    "#ff8c00",
    "#ffd700",
    "#90ee90",
    "#00ced1",
    "#1e90ff",
    "#c71585",
    "rgba(255, 69, 0, 0.68)",
    "rgb(255, 120, 0)",
    "hsv(51, 100, 98)",
    "hsva(120, 40, 94, 0.5)",
    "hsl(181, 100%, 37%)",
    "hsla(209, 100%, 56%, 0.73)",
    "#c7158577"
  ]
};
