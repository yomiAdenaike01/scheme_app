import vars from "@/assets/Styles/defaults.scss";

const getStorage = key => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : {};
};

export default {
  theme: localStorage.getItem("cssText"),
  serverHealth: {},
  requestIntervals: {
    team: 6000,
    shifts: 6000,
    client: 4000
  },
  clientInformation: getStorage("clientInformation"),
  environmentURL:
    process.env.NODE_ENV == "development"
      ? "http://localhost:7070/"
      : "https://schemeapi.now.sh/",
  token: getStorage("token"),
  userInformation: getStorage("userInformation"),
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
    "#f5365c",
    "#fb6340",
    "#ffd600",
    "#2dce89"
  ]
};
