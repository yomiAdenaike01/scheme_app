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
      let format = 'YYYY-MM-DD HH:mm'
      let shiftEvents = []
      for (let i = 0; i < len; i++) {
        let shift = shifts[i]
        let shiftContent = returnShiftContent(state, shift)
        let shiftEvent = {
          id: shift._id,
          start: moment(shift.startDate).format(format),
          end: moment(shift.endDate).format(format),
          content: shiftContent.text,
          class: shiftContent.class,
          assigned_to: shiftContent.name,
          type: shiftContent.type,
          is_pickup: shift.is_pickup
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
  })
}
function returnShiftContent(state, shift) {
  let isPickup = shift.is_pickup
  let user = !isPickup
    ? getName(state, shift.assigned_to)
    : { name: 'Avaliable for pickup' }
  let returnVal = {
    text: '',
    type: '',
    class: '',
    name: ''
  }
  if (user) {
    let name = user.name
    let type = shift.shift_type
    let shiftClass = ''
    let shiftTitle = ''
    let shiftType = ''
    switch (type) {
      case 1: {
        shiftClass = 'normal_staff'
        shiftTitle = 'Regular shift'
        break
      }
      case 2: {
        shiftClass = 'locumn'
        shiftTitle = 'Locumn shift'

        break
      }
      case 3: {
        shiftClass = 'holiday'
        shiftTitle = 'Holiday'

        break
      }
      case 4: {
        shiftClass = 'time_off'
        shiftTitle = 'Time off'

        break
      }
      case 5: {
        shiftClass = 'sick_leave'
        shiftTitle = 'Sick leave'

        break
      }
      default:
        break
    }
    returnVal = {
      text: !isPickup ? `${shiftTitle} ${name}` : name,
      type: shiftTitle,
      class: shiftClass,
      name: name
    }
  }
  return returnVal
}
