import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/HelloWorld'
import CarOffer from '@/components/CarOffer'
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
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/Profile',
      name: 'Profile',
      component: Profile
    },
    {
      path: '/CarOffer',
      name: 'CarOffer',
      component: CarOffer
    },
    {
      path: '/CarSearch',
      name: 'CarSearch',
      component: CarSearch
    }
  ]
})
