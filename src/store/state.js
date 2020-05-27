export default {
  runningIntervals: {},
  notificationRef: {},
  groupRef: {},
  teamRef: {},

  globalIntervals: {
    admin: 6000,
    client: 2000,
    chat: 3000
  },

  token: localStorage.getItem("token") ? localStorage.getItem("token") : "",

  clientInformation: {},
  userInformation: {},
  errorInformation: {},
  team: [],

  systemNotifications: [],
  apiNotifications: [],

  networkError: false,
  viewMobileMenu: false,

  overlayHistory: {},
  overlayIndex: {
    viewEvent: { view: false, data: {} },
    eventModule: { view: false, data: {} }
  },
  colours: [
    "#0168fa",
    "#5b47fb",
    "#6f42c1",
    "#f10075",
    "#fd7e14",
    "#00cccc",
    "#7987a1",
    "#10b759",
    "#00b8d4",
    "#ffc107",
    "#dc3545",
    "#3b4863"
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
