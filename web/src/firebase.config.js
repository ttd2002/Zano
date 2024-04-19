// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXjQXG6XbCaIxXH-j7I8LM5g8Sg2qDSoo",
  authDomain: "cnm-zalo-web.firebaseapp.com",
  projectId: "cnm-zalo-web",
  storageBucket: "cnm-zalo-web.appspot.com",
  messagingSenderId: "323062489503",
  appId: "1:323062489503:web:092ebe0609a5372e225daa",
  measurementId: "G-K7DFJJDCT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);