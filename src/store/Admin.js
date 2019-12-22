import moment from 'moment'
export default {
  namespaced: true,
  state: { team: [], shifts: [], requests: [], viewUser: '' },
  actions: {
    getShifts(context) {
      const payload = {
        method: 'GET',
        url: '/shifts/all'
      }
      context.dispatch('request', payload, { root: true }).then(response => {
        context.commit('UPDATE_SHIFTS', response)
      })
    },

    getTeam(context) {
      const payload = {
        method: 'GET',
        url: '/users/all'
      }
      context.dispatch('request', payload, { root: true }).then(response => {
        context.commit('UPDATE_TEAM', response)
      })
    }
  },

  mutations: {
    UPDATE_SHIFTS(state, payload) {
      state.shifts = payload
    },
    UPDATE_REQUESTS(state, payload) {
      state.requests = payload
    },
    UPDATE_TEAM(state, payload) {
      state.team = payload
    },
    UPDATE_VIEW_USER(state, payload) {
      state.viewUser = payload
    }
  },
  getters: {
    getShifts(state) {
      let shifts = state.shifts
      let len = shifts.length
      let format = 'YYYY-MM-DD HH:MM'
      let shiftEvents = []
      for (let i = 0; i < len; i++) {
        let shift = shifts[i]
        let shiftEvent = {
          id: shift._id,
          start: moment(shift.startDate).format(format),
          end: moment(shift.endDate).format(format),
          title: returnShiftContent(state, shift).text,
          content: '',
          class: '',
          assigned_to: getName(state, shift.assigned_to)
        }
        shiftEvents.push(shiftEvent)
      }
      return shiftEvents
    }
  }
}
function getName(state, id) {
  return state.team.find(member => {
    return member._id == id
  }).name
}
function returnShiftContent(state, shift) {
  let user = getName(state, shift.assigned_to)

  return { text: `Shift ${user}`, name: user }
}
