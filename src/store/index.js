import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
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
    currentUser: storage.get('currentUser'),
    team: [],
    shifts: [],
    requests: [],
    messages: [],
    transcripts: [],
    notifications: []
  },
  mutations: {
    CREATE_NOTIFICATION(state, payload) {
      state.notifications.push(payload)
    },
    UPDATE_USER(state, payload) {
      state.currentUser = payload.user
      state.token = payload.token
      storage.set('token', payload.token)
      storage.set('currentUser', payload.user)
    },
    UPDATE_MESSAGES(state) {},
    UPDATE_TRANSCRIPTS(state) {},
    UPDATE_SHIFTS(state) {},
    UPDATE_REQUESTS(state) {},
    UPDATE_TEAM(state, payload) {
      state.team = payload
    }
  },
  getters: {
    getIsAdmin(state) {
      return state.currentUser.employee_type == 1
    }
  },
  actions: {
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
            context.commit('CREATE_NOTIFICATION', response)
            return response
          }
        })
        .catch(error => {
          error = error.data
          context.commit('CREATE_NOTIFICATION', error)
          return error
        })
    }
  },
  modules: {}
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
