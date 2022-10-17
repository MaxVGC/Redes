import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDzh6Wyzqa4lchjxJ3DorKvkmDzi21JOh4",
    authDomain: "server-smtp-redes.firebaseapp.com",
    projectId: "server-smtp-redes",
    storageBucket: "server-smtp-redes.appspot.com",
    messagingSenderId: "43858599147",
    appId: "1:43858599147:web:0001e65377a77218b6b2ae"
  };

  export const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);
  export const auth = getAuth(app);