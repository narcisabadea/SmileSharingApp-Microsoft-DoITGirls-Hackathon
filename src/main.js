import Vue from 'vue'
import App from './App'
import store from '@/store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as firebase from '@/firebase'
import Vuex from 'vuex'

Vue.use(Vuetify)
Vue.use(Vuex)
// router.push({ path: '/Home' })

Vue.config.productionTip = false

const vuetifyInit = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#34344A',
        secondary: '#201F1D',
        success: '#17A398',
        danger: '#EE6C4D',
        warning: '#E3B23C',
        background: '#F7F7FF'
      },
      dark: {
        primary: '#34344A',
        secondary: '#201F1D',
        success: '#17A398',
        danger: '#EE6C4D',
        warning: '#E3B23C',
        background: '#F7F7FF'
      },
    },
  },
})

new Vue({
  el: '#app',
  firebase,
  store,
  vuetify : vuetifyInit,
  render: h => h(App)
});

