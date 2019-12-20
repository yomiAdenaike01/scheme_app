import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Comms from './Comms'
Vue.use(Vuex)
axios.defaults.baseURL = 'http://localhost:3000/api'
const storage = {
  get(item) {
    if (localStorage.getItem(item)) {
      return localStorage.getItem(item)
    } else {
      return {}
    }
  },
  set(key, item) {
    if (typeof item == 'object') {
      item = JSON.stringify(item)
    }
    localStorage.setItem(key, item)
  }
}
export default new Vuex.Store({
  state: {
    token: storage.get('token'),
    currentUser: JSON.parse(storage.get('currentUser')),
    team: [],
    shifts: [],
    requests: []
  },
  mutations: {
    UPDATE_USER(state, payload) {
      state.currentUser = payload.user
      state.token = payload.token
      storage.set('token', payload.token)
      storage.set('currentUser', payload.user)
    },

    UPDATE_SHIFTS(state, payload) {
      state.shifts = payload
    },
    UPDATE_REQUESTS(state) {},

    UPDATE_TEAM(state, payload) {
      const index = payload.findIndex(x => {
        delete x.password
        return x._id == state.currentUser._id
      })
      payload.splice(index, 1)
      state.team = payload
    }
  },
  getters: {
    getContentLoaded(state) {
      console.log(state)
      return (
        state.shifts.length <= 0 &&
        state.Comms.transcripts.length <= 0 &&
        state.team.length <= 0
      )
    },
    getIsAdmin(state) {
      return state.currentUser.employee_type == 1
    }
  },
  actions: {
    getShifts(context) {
      const payload = {
        method: 'GET',
        url: '/shifts/all'
      }
      context
        .dispatch('request', payload)
        .then(response => {
          context.commit('UPDATE_SHIFTS', response)
        })
        .catch(error => {
          this.$notify.error({
            title: 'Error',
            message: error.message
          })
          console.error(error)
        })
    },

    getTeam(context) {
      if (context.state.team.length <= 0) {
        const payload = {
          method: 'GET',
          url: '/users/all'
        }
        context
          .dispatch('request', payload)
          .then(response => {
            context.commit('UPDATE_TEAM', response)
          })
          .catch(error => {
            return error
          })
      }
    },
    request(context, payload) {
      payload = sortPayload(context.state, payload)
      return axios(payload)
        .then(response => {
          response = response.data
          if (response.hasOwnProperty('success')) {
            return response.content
          } else if (response.hasOwnProperty('error')) {
            this.$notify.error({
              title: 'Error',
              message: error.message
            })
            return response
          }
        })
        .catch(error => {
          error = error.data
          this.$notify.error({
            title: 'Error',
            message: error
          })
          return error
        })
    }
  },
  modules: { Comms }
})

const sortPayload = (state, payload) => {
  const token = state.token
  const clientID = state.clientID
  if (token) {
    payload.headers = { authorisation: token }
  }
  if (clientID) {
    payload.data.clientID = clientID
  }
  return payload
}
