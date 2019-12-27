import axios from 'axios'
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'http://localhost:5000/'
} else {
  axios.defaults.baseURL = 'https://schemeapi.now.sh/'
}

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

export default {
  updateSettings(context) {
    return new Promise((resolve, reject) => {
      context
        .dispatch('request', {
          method: 'POST',
          url: 'settings/update',
          data: context.state.localSettings
        })
        .then(response => {
          context.commit('UPDATE_NOTIFICATIONS', response)
          resolve(response)
        })
        .catch(error => {
          context.commit('UPDATE_NOTIFICATIONS', error)
          reject(error)
        })
    })
  },
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
}
