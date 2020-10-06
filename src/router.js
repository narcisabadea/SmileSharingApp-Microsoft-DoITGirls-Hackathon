import Vue from 'vue'
import Router from 'vue-router'
import CarSearch from '@/components/CarSearch'
import Profile from '@/components/Profile'
import App from '@/App'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App,
      redirect: 'Home'
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/CarSearch',
      name: 'CarSearch',
      component: CarSearch
    }
  ]
})
