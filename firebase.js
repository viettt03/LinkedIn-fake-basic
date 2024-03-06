// import { initializeApp } from "firebase/app";

import firebase from 'firebase/compat/app';
import "firebase/compat/auth"
import "firebase/compat/firestore"
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBmgK0ZmzNlM9zwpjKLiTY9KYHTOuHUoZs",
    authDomain: "linkedin-bb01c.firebaseapp.com",
    projectId: "linkedin-bb01c",
    storageBucket: "linkedin-bb01c.appspot.com",
    messagingSenderId: "89919720264",
    appId: "1:89919720264:web:62fd0ae516314fdc76817d"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };