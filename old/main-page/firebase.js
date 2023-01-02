import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import {
  getDatabase,
  ref,
  set,
  child,
  update,
  remove,
  onValue,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js'

const firebaseConfig = {
  apiKey: 'AIzaSyAqRt-Q3UQTtvnhi6wvTznXSbHF36sNWGo',
  authDomain: 'rfid-database-abd32.firebaseapp.com',
  databaseURL:
    'https://rfid-database-abd32-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'rfid-database-abd32',
  storageBucket: 'rfid-database-abd32.appspot.com',
  messagingSenderId: '675135234485',
  appId: '1:675135234485:web:0366155cb9607662f5f9fc',
}

const cardID = document.querySelector('#card-id')
const app = initializeApp(firebaseConfig)

var db = getDatabase()
var connect_db = ref(db, 'card/' + 'id/')

onValue(connect_db, (snapshot) => {
  cardID.value = snapshot.val()
  cardID.style =
    'background-color: white; animation-name: none; font-weight: bold; color: black'
})
