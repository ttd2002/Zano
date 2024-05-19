import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

export const firebaseConfig = {
    apiKey: "AIzaSyDIUInIpELtr03hsnv6_lpDPBFFHBTXfns",
    authDomain: "otpsskdt.firebaseapp.com",
    projectId: "otpsskdt",
    storageBucket: "otpsskdt.appspot.com",
    messagingSenderId: "266856419870",
    appId: "1:266856419870:web:335a178ecf6eb5f3ce140f",
    measurementId: "G-K6TGF7ETX5"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}
