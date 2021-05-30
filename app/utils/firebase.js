import * as firebase from "firebase"; 

const firebaseConfig = {
    apiKey: "AIzaSyBj25ArE_THULAsRcJWKfC0Df3ueRqmOqk",
    authDomain: "dogscats-8345e.firebaseapp.com",
    projectId: "dogscats-8345e",
    storageBucket: "dogscats-8345e.appspot.com",
    messagingSenderId: "1046148999260",
    appId: "1:1046148999260:web:53fbbb32b895d1ac71de99"
}
export const firebaseApp = firebase.initializeApp(firebaseConfig);