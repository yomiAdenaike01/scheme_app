import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Comms from './Comms'
import Admin from './Admin'

Vue.use(Vuex)
axios.defaults.baseURL = 'http://localhost:3000/api'
const storage = {
  remove(item) {
    if (this.get(item)) {
      localStorage.removeItem(item)
    }
  },
  get(item) {
    if (localStorage.getItem(item)) {
      return localStorage.getItem(item)
    } else {
      return
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
    currentUser: storage.get('currentUser')
      ? JSON.parse(storage.get('currentUser'))
      : {},

    notifications: []
  },
  mutations: {
    REMOVE_USER(state) {
      state.currentUser = {}
      state.token = {}
      storage.remove('token')
      storage.remove('currentUser')
    },
    UPDATE_USER(state, payload) {
      state.currentUser = payload.user
      state.token = payload.token
      storage.set('token', payload.token)
      storage.set('currentUser', payload.user)
    },

    UPDATE_NOTIFICATIONS(state, notification) {
      state.notifications = notification
    }
  },
  getters: {
    getContentLoaded(state) {
      return false
    },
    getIsAdmin(state) {
      const employee_type = state.currentUser.employee_type
      return employee_type == 1 || employee_type == 'Admin'
    }
  },
  actions: {
    request(context, payload) {
      payload = sortPayload(context.state, payload)
      return axios(payload)
        .then(response => {
          response = response.data
          if (response.hasOwnProperty('success')) {
            return response.content
          } else if (response.hasOwnProperty('error')) {
            context.commit('UPDATE_NOTIFICATIONS', response)
          }
        })
        .catch(error => {
          error = error.data
          console.log(error)

          context.commit('UPDATE_NOTIFICATIONS', error)
        })
    }
  },
  modules: { Comms, Admin }
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
