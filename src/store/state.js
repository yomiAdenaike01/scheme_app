import vars from "@/assets/Styles/defaults.scss";
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
    vars.default,
    "#5e72e4",
    "#5603ad",
    "#8965e0",
    "#f3a4b5",
    "#f5365c",
    "#fb6340",
    "#ffd600",
    "#2dce89"
  ]
};
