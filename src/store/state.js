let baseStyle = getComputedStyle(document.body);
const getStyle = cssVar => {
  return baseStyle.getPropertyValue(cssVar);
};

export default {
  team: [],

  globalIntervals: {},
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
    profile: { view: false, data: {} },
    viewEvent: { view: false, data: {} },
    eventModule: { view: false, data: {} },
    tutorial: { view: false, data: {} },
    prevEvents: { view: false, data: {} },
    task: { view: false, data: {} }
  },

  colours: [
    "#0168fa",
    "#5b47fb",
    "#6f42c1",
    "#f10075",
    "#dc3545",
    "#fd7e14",
    "#ffc107",
    "#10b759",
    "#00cccc",
    "#00b8d4",
    "#7987a1",
    "#3b4863",
    "#0168fa",
    "#7987a1",
    "#10b759",
    "#00b8d4",
    "#ffc107",
    "#dc3545",
    "#f4f5f8",
    "#3b4863"
  ],

  theme: {
    primary: getStyle("--colour_primary"),
    secondary: getStyle("--colour_secondary"),
    tertiary: getStyle("--colour_tertiary")
  },

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
