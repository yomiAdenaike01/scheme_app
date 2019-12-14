import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './../store/index'
const login = () => import('@/views/User/Login')
const dashboard = () => import('@/views/Admin/Dashboard')
const schedule = () => import('@/views/Admin/Schedule')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: dashboard,
    meta: {
      title: 'Dashboard',
      authRequired: true
    }
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: schedule,
    meta: {
      title: 'schedule',
      authRequired: true
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some(route => route.meta.authRequired)
  const isLoggedIn = Object.keys(store.state.currentUser).length > 0

  if (authRequired) {
    if (!isLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
