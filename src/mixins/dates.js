import moment from 'moment'
export default {
  methods: {
    format(date, format) {
      const _date = moment(date).format(format)
      console.log(_date, date)
      return _date
    }
  }
}
