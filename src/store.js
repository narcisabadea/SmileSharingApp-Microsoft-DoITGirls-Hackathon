import Vue from "vue";
import Vuex from "vuex";
import firebase from "@/firebase";
// import router from '@/router'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userDetails: null,
    requestsDetails: []
  },
  mutations: {
    setUserDetails(state, payload) {
      state.userDetails = payload;
    },
    setRequestsData(state, payload) {
      state.requestsDetails = payload;
    }
  },
  actions: {
    getUserDetails({ commit }) {
      commit("setUserDetails", JSON.parse(localStorage.getItem("details")));
    },
    login({ commit }, payload) {
      return firebase
        .firestore()
        .collection("Users")
        .doc(payload.username)
        .get()
        .then((snapshot) => {
          let details = {
            name: snapshot.data().name,
            surname: snapshot.data().surname,
            email: snapshot.data().email,
            phone: snapshot.data().phone,
            type: snapshot.data().type,
            username: snapshot.id,
            password: snapshot.data().password,
            rides: snapshot.data().rides,
            myrides: snapshot.data().myrides,
          };
          if (details.password === payload.password) {
            localStorage.setItem("details", JSON.stringify(details));
            commit(
              "setUserDetails",
              JSON.parse(localStorage.getItem("details"))
            );
          }
        });
    },
    logout({ commit }) {
      commit("setUserDetails", null);
      localStorage.clear();
    },
    getRequestsData({commit}) {
      firebase.firestore()
        .collection("Requests")
        .onSnapshot((snapshot) => {
          const items = []
          snapshot.forEach((obj) => {
            items.push({
              id: obj.id,
              car: obj.data().car,
              dateLeave: obj.data().dateLeave,
              dropPoint: obj.data().dropPoint,
              hourLeave: obj.data().hourLeave,
              localityGoing: obj.data().localityGoing,
              localityLeave: obj.data().localityLeave,
              meetingPoint: obj.data().meetingPoint,
              minLeave: obj.data().minLeave,
              noSeats: obj.data().noSeats,
              phone: obj.data().phone,
              price: obj.data().price,
              participants: obj.data().participants,
            });
          });
          commit("setRequestsData", items);
        });
    }
  },
  getters: {
    userDetails: (state) => state.userDetails,
    requestsDetails: (state) => state.requestsDetails
  },
});
