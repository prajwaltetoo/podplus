// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC5fmdn8dTuipQQAuzGq4lft5lQDXWkLMA",
    authDomain: "podpulse-15a9e.firebaseapp.com",
    projectId: "podpulse-15a9e",
    storageBucket: "podpulse-15a9e.appspot.com",
    messagingSenderId: "630693944180",
    appId: "1:630693944180:web:215ad5325f45d308462a21",
    measurementId: "G-QBNTVB2X4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, db, storage };