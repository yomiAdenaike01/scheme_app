export default {
  runningIntervals: {},
  team: [],
  notificationRef: "",
  requestIntervals: {
    admin: 60000,
    client: 20000,
    chatMessages: 3000,
    chat: 30000,
    templates: 30000
  },
  clientInformation: {},
  token: localStorage.getItem("token"),
  userInformation: {},
  errorInformation: {},
  systemNotifications: [],
  networkError: false,
  apiNotifications: [],
  viewMobileMenu: false,
  lastDialog: {},
  dialogIndex: {
    profile: { view: false, data: null, tabIndex: 0 },
    viewEvent: { view: false, data: null, tabIndex: 0 },
    eventModule: { view: false, data: null, tabIndex: 0 },
    tutorial: { view: false, data: null, tabIndex: 0 },
    prevEvents: { view: false, data: null, tabIndex: 0 },
    task: { view: false, data: null, tabIndex: 0 }
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

  rootGroupRef: ""
};
