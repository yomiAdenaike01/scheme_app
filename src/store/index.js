import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Comms from './Comms'
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
    team: [],
    shifts: [],
    requests: [],
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

    UPDATE_SHIFTS(state, payload) {
      state.shifts = payload
    },
    UPDATE_REQUESTS(state) {},
    UPDATE_NOTIFICATIONS(state, notification) {
      state.notifications = notification
    },

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
      return false
    },
    getIsAdmin(state) {
      const employee_type = state.currentUser.employee_type
      return employee_type == 1 || employee_type == 'Admin'
    },
    getTeam(state) {
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
        console.log(state.currentUser._id, member._id)
        return member._id != state.currentUser._id
      })
    }
  },
  actions: {
    getShifts(context) {
      const payload = {
        method: 'GET',
        url: '/shifts/all'
      }
      context.dispatch('request', payload).then(response => {
        context.commit('UPDATE_SHIFTS', response)
      })
    },

    getTeam(context) {
      if (context.state.team.length <= 0) {
        const payload = {
          method: 'GET',
          url: '/users/all'
        }
        context.dispatch('request', payload).then(response => {
          context.commit('UPDATE_TEAM', response)
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
