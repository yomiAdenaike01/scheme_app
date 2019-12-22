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
      if (context.state.team.length <= 0) {
        const payload = {
          method: 'GET',
          url: '/users/all'
        }
        context.dispatch('request', payload, { root: true }).then(response => {
          console.log(response)
          context.commit('UPDATE_TEAM', response)
        })
      }
    }
  },

  mutations: {
    UPDATE_SHIFTS(state, payload) {
      state.shifts = payload
    },
    UPDATE_REQUESTS(state) {},
    UPDATE_TEAM(state, payload) {
      state.team = payload
    },
    UPDATE_VIEW_USER(state, payload) {
      state.viewUser = payload
    }
  },
  getters: {
    getTeam(state) {
      return state.team
    }
  }
}
