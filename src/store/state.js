export default {
  team: [],

  runningIntervals: {},
  notificationRef: {},
  groupRef: {},
  teamRef: {},

  requestIntervals: {
    admin: 60000,
    client: 20000,
    chatMessages: 3000,
    chat: 30000,
    templates: 30000
  },

  token: localStorage.getItem("token") ? localStorage.getItem("token") : {},

  clientInformation: {},
  userInformation: {},
  errorInformation: {},

  systemNotifications: [],
  apiNotifications: [],

  networkError: false,
  viewMobileMenu: false,

  overlayHistory: {},
  overlayIndex: {
    profile: { view: false, data: null },
    viewEvent: { view: false, data: null },
    eventModule: { view: false, data: null },
    tutorial: { view: false, data: null },
    prevEvents: { view: false, data: null },
    task: { view: false, data: null }
  },

  colours: [
    "#6ca5d8",
    "#c9249e",
    "#6f3e9e",
    "#232323",
    "#ec305c",
    "#ff8840",
    "#f3c43a",
    "#cccccc",
    "#44a954"
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
