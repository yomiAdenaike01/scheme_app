import moment from 'moment'
export default {
  methods: {
    toISO(date) {
      return moment(date).toISOString()
    },
    format(date, format) {
      const _date = moment(date).format(format)

      return _date
    }
  }
}
