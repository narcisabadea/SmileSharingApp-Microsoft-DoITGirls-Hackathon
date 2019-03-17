import Vue from 'vue'
import App from './App'
import router from '@/router'
import store from '@/store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as firebase from '@/firebase'
import Vuex from 'vuex'

Vue.use(Vuetify)
Vue.use(Vuex)
// router.push({ path: '/Home' })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  firebase,
  store,
  render: h => h(App)
});