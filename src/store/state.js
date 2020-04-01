import vars from "@/assets/Styles/defaults.scss";
export default {
  runningIntervals: {},
  requestIntervals: {
    team: 6000,
    events: 6000,
    client: { id: "client", immediate: true, duration: 10000 },
    messages: 3000,
    transcripts: 3000,
    templates: 3000
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
  errorInformation: {},
  localNotifications: [],
  networkError: false,
  weeklyTimesheetUploaded: false,
  userNotifications: [],
  viewMobileMenu: false,

  defaultSize: {
    minFontSize: "10px",
    maxFontSize: "16px"
  },

  dialogIndex: {
    profile: { view: false, data: null, tabIndex: 0 },
    viewEvent: { view: false, data: null, tabIndex: 0 },
    eventModule: { view: false, data: null, tabIndex: 0 },
    tutorial: { view: false, data: null, tabIndex: 0 },
    prevEvents: { view: false, data: null, tabIndex: 0 },
    task: { view: false, data: null, tabIndex: 0 }
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
  ],
  daysOfWeek: [
    {
      text: "Mondays",
      value: 1
    },
    {
      text: "Tuesdays",
      value: 2
    },
    {
      text: "Wednesdays",
      value: 3
    },
    {
      text: "Thursdays",
      value: 4
    },
    {
      text: "Fridays",
      value: 5
    },
    {
      text: "Saturdays",
      value: 6
    },
    {
      text: "Sundays",
      value: 7
    }
  ]
};
