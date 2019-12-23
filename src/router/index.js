import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './../store/index'
const login = () => import('@/views/User/Login')
const dashboard = () => import('@/views/Admin/Dashboard')
const schedule = () => import('@/views/Admin/Schedule')
const messenger = () => import('@/views/Comms/Messenger')
const reports = () => import('@/views/Admin/Reports')
const logout = () => import('@/views/User/Logout')

const admin = () => import('@/views/router_views/Admin')
const comms = () => import('@/views/router_views/Comms')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'login' }
  },
  {
    path: '/logout',
    name: 'logout',
    component: logout,
    meta: {
      title: 'logout'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: admin,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: dashboard,
        meta: {
          title: 'Dashboard',
          authRequired: true
        }
      },
      {
        path: 'schedule',
        name: 'schedule',
        component: schedule,
        meta: {
          title: 'Schedule',
          authRequired: true
        }
      },
      {
        path: 'reports',
        name: 'reports',
        component: reports,
        meta: {
          title: 'Reports',
          authRequired: true
        }
      }
    ]
  },
  {
    path: '/comms',
    name: 'comms',
    component: comms,
    children: [
      {
        path: 'messenger',
        name: 'messenger',
        component: messenger,
        meta: {
          title: 'Messenger',
          authRequired: true
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some(route => route.meta.authRequired)
  const isLoggedIn = Object.keys(store.state.currentUser).length > 0
  document.title = to.meta.title
  if (authRequired) {
    if (!isLoggedIn) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
  if (to.name == 'login') {
    if (isLoggedIn) {
      next({
        name: 'dashboard',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
})

export default router
