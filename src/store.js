import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '@/firebase'
// import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userDetails: null
  },
  mutations: {
    setUserDetails(state, payload) {
      state.userDetails = payload
    }
  },
  actions: {
    getUserDetails({ commit }) {
      commit('setUserDetails', JSON.parse(localStorage.getItem('details')))
    },
    login({ commit },payload) {
      return firebase.firestore().collection('Users').doc(payload.username).get()
        .then(snapshot => {
          let details = {
            name: snapshot.data().name,
            surname: snapshot.data().surname,
            email: snapshot.data().email,
            phone: snapshot.data().phone,
            type: snapshot.data().type,
            username: snapshot.id,
            password: snapshot.data().password,
            rides: snapshot.data().rides,
            myrides: snapshot.data().myrides
          }
          if (details.password === payload.password) {
            localStorage.setItem('details', JSON.stringify(details))
            commit('setUserDetails', JSON.parse(localStorage.getItem('details')))
          }
        })
      },
      logout ({commit}) {
        commit('setUserDetails', null)
        localStorage.clear()
      }
    },
    getters: {
      userDetails: state => state.userDetails
    }
  })