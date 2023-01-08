import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getDatabase()
