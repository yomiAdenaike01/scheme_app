export default {
  reportPanels: [
    {
      name: "daily_shift_report",
      type: "",
      data: [],
      labels: [],
      colours: []
    },
    [
      {
        name: "monthly_shift_report",
        type: "",
        data: [],
        labels: [],
        colours: []
      },
      {
        name: "weekly_shift_report",
        type: "",
        data: [],
        labels: [],
        colours: []
      },
      {
        name: "tasks",
        colours: [],
        data: [],
        labels: []
      }
    ],
    [
      {
        name: "monthly_shift_report",
        type: "",
        data: [],
        labels: [],
        colours: []
      },
      {
        name: "weekly_shift_report",
        type: "",
        data: [],
        labels: [],
        colours: []
      },
      {
        name: "tasks",
        colours: [],
        data: [],
        labels: []
      }
    ]
  ],
  viewNote: {
    display: false
  },
  team: [],
  notes: [],
  tasks: [],
  shifts: {
    all: [],
    upcoming: [],
    today: [],
    previous: []
  },
  requests: [],
  viewTeamMember: { view: false, id: null },
  // 1 (admin), 2(Normal), 3(Locumn)
  groupIDs: [
    {
      name: "System Administrator",
      value: 1
    },
    {
      name: "General Staff",
      value: 2
    }
  ]
};
