import vars from "@/assets/Styles/defaults.scss";
export default {
  runningIntervals: {},
  requestIntervals: {
    team: 6000,
    events: 6000,
    client: { id: "client", immediate: true, duration: 10000 },
    chatMessages: 3000,
    previousChats: 3000,
    templates: 3000
  },
  clientInformation: localStorage.getItem("clientInformation")
    ? JSON.parse(localStorage.getItem("clientInformation"))
    : {},

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
      label: "Mondays",
      value: 1
    },
    {
      label: "Tuesdays",
      value: 2
    },
    {
      label: "Wednesdays",
      value: 3
    },
    {
      label: "Thursdays",
      value: 4
    },
    {
      label: "Fridays",
      value: 5
    },
    {
      label: "Saturdays",
      value: 6
    },
    {
      label: "Sundays",
      value: 7
    }
  ]
};
