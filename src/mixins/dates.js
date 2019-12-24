import moment from 'moment'
export default {
  computed: {
    now() {
      return moment()
    }
  },
  methods: {
    duration(date, diff) {
      let _date = moment(date)
      return moment.duration(_date.diff(diff))
    },
    isFuture(date, isNow, afterDate) {
      if (isNow) {
        return moment(date).isAfter(this.now)
      } else {
        return moment(date).isAfter(afterDate)
      }
    },
    isToday(date) {
      return moment(date).isSame(new Date(), 'day')
    },
    toISO(date) {
      return moment(date).toISOString()
    },
    format(date, format) {
      const _date = moment(date).format(format)

      return _date
    },
    calendar(date) {
      return moment(date).calendar()
    },
    isThisWeek(date) {
      const now = this.now
      return moment(date).isBetween(now.startOf('week'), now.endOf('week'))
    }
  }
}
