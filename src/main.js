import Vue from 'vue'
import App from './App'
import router from '@/router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as firebase from '@/firebase'

Vue.use(Vuetify)
// router.push({ path: '/Home' })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  firebase,
  render: h => h(App)
});