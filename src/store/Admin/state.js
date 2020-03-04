export default {
  eventFilters: {},
  viewNote: {
    display: false
  },
  teamInformation: [],
  notes: [],
  tasks: [],
  eventsInformation: {
    all: [],
    upcoming: [],
    today: [],
    previous: []
  },
  requestsInformation: [],
  featureRequests:{
    all:[],
    user:[]
  },
  /**
   * 
   * title,
   * endpoint,
   * type: card, bar, pie, table,
   * category
   * 
   * analytics
   * categories
   *  user (online, offline , count of each group(event,user) events participated in pie chart of breakdown of their totoal hours)
    events (number of events in total, break down of type(pie),)
   
   */
  analyticsPresentation: {
    barPercentage: 0.5,
    barThickness: 6,
    maxBarThickness: 8,
    minBarLength: 2
  }
};
