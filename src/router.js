import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/HelloWorld'
import Profile from '@/components/Profile'
import App from '@/App'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: App
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: Profile
    }
  ]
})