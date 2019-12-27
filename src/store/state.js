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
export default {
  token: storage.get('token'),
  currentUser: storage.get('currentUser')
    ? JSON.parse(storage.get('currentUser'))
    : {},
  globalLoader: false,
  notifications: [],
  preferences: {},
  viewNotificationsCenter: false,
  userNotifications: [],
  currentInterval: ''
}
