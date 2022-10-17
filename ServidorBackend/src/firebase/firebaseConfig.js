const { initializeApp } = require('firebase/app')
const { getAuth } = require('firebase/auth')
const { getFirestore } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyDzh6Wyzqa4lchjxJ3DorKvkmDzi21JOh4",
  authDomain: "server-smtp-redes.firebaseapp.com",
  projectId: "server-smtp-redes",
  storageBucket: "server-smtp-redes.appspot.com",
  messagingSenderId: "43858599147",
  appId: "1:43858599147:web:0001e65377a77218b6b2ae"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

module.exports={app,db,auth}