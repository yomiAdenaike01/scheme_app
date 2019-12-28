import storage from './storage'
export default {
  token: storage.get('token'),
  currentUser: storage.get('currentUser')
    ? JSON.parse(storage.get('currentUser'))
    : {},
  globalLoader: false,
  notifications: [],
  localSettings: {
    general: {
      live_schedule: false,
      live_notifications: false,
      live_dashboard: false,
      notifications: false
    },
    security: {}
  },
  viewNotificationsCenter: false,
  userNotifications: [],
  currentInterval: '',
  viewMobileMenu: false,
  defaultSize: { minFontSize: '10px', maxFontSize: '16px' }
}
