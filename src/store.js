import Vue from 'vue'
import Vuex from 'vuex'
// import firebase from '@/firebase'
// import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store ({
    state: {
        userDetails: null
    },
    mutations: {
        setUserDetails(state, payload) {
            state.userDetails = payload
          }
    },
    actions: {
        getUserDetails ({commit}) {
            commit('setUserDetails', JSON.parse(localStorage.getItem('userDetails')))
        }
    },
    getters: {
        userDetails: state => state.userDetails
    }
})