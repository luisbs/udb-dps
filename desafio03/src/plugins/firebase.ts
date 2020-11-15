import firebase from "firebase";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDb3Jj7Oab5x74Kj-umeRtb0szPvmCz_Sc",
  authDomain: "dps-desafio03.firebaseapp.com",
  databaseURL: "https://dps-desafio03.firebaseio.com",
  projectId: "dps-desafio03",
  storageBucket: "dps-desafio03.appspot.com",
  messagingSenderId: "473523029710",
  appId: "1:473523029710:web:1c4f8e0a5444ac40c0729f",
};

firebase.initializeApp(firebaseConfig);

// Utils
export default firebase;
export const Auth = firebase.auth();
export const Firestore = firebase.firestore();
