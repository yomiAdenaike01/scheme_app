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
    globalLoader: false,
    notifications: [],
    preferences: {},
    viewNotificationsCenter: false,
    userNotifications: {},
    currentInterval: ''
  },
  mutations: {
    UPDATE_USER_NOTIFICATIONS(state, payload) {
      state.userNotifications = payload
    },
    UPDATE_VIEW_NOTIFICATIONS_CENTER(state, payload) {
      state.viewNotificationsCenter = payload
    },
    UPDATE_PREFERENCES(state, payload) {
      state.preferences = payload
    },
    UPDATE_GLOBAL_LOADER(state, payload) {
      state.globalLoader = payload
    },
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
      if (notification.type == 'success') {
        notification.title = 'Opeartion Successful'
      } else if (notification.type == 'error') {
        notification.title = 'Operation Unsuccessful'
      }
      state.notifications.unshift(notification)
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
    getNotifications(context) {
      context
        .dispatch('request', {
          url: '/notifications/all',
          method: 'GET'
        })
        .then(response => {
          context.commit('UPDATE_USER_NOTIFICATIONS', response)
        })
        .catch(error => {
          return error
        })
    },
    request(context, payload) {
      payload = sortPayload(context.state, payload)
      return axios(payload)
        .then(response => {
          response = response.data
          if (response.hasOwnProperty('success')) {
            if (typeof response.content == 'string') {
              context.commit('UPDATE_NOTIFICATIONS', {
                message: response.content,
                title: 'Operation Successful',
                type: 'success'
              })
            }
            return response.content
          } else if (response.hasOwnProperty('error')) {
            context.commit('UPDATE_NOTIFICATIONS', {
              message: response.content,
              title: 'Operation Failed',
              type: 'error'
            })
          }
        })
        .catch(error => {
          error = error.data.content
          context.commit('UPDATE_NOTIFICATIONS', {
            message: error,
            title: 'Error when processing request',
            type: 'error'
          })
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
