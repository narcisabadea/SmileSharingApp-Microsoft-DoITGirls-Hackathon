import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

var config = {
  apiKey: 'AIzaSyCozt74iePl0T_KzGlAfiJuXlMrLRi6REg',
  authDomain: 'doitgirls-ed93d.firebaseapp.com',
  databaseURL: 'https://doitgirls-ed93d.firebaseio.com',
  projectId: 'doitgirls-ed93d',
  storageBucket: 'doitgirls-ed93d.appspot.com',
  messagingSenderId: '833174031026'
}

const firebaseApp = firebase.initializeApp(config)

export default firebaseApp