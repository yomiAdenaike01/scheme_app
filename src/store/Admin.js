export default {
  namespaced: true,
  state: { team: [], shifts: [], requests: [] },
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
    }
  },
  getters: {
    getTeam(state, getters, rootState) {
      return state.team.filter(member => {
        switch (member.employee_type) {
          case 1: {
            member.employee_type = 'Admin'
            break
          }
          case 2: {
            member.employee_type = 'Staff'
            break
          }
          case 3: {
            member.employee_type = 'Locumn'
            break
          }
        }
        return member._id != rootState.currentUser._id
      })
    }
  }
}
