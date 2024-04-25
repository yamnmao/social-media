// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYtFfydlzp0dQ4vGlBBdAH_nRhOSfTK1c",
  authDomain: "social-media-b6d4e.firebaseapp.com",
  projectId: "social-media-b6d4e",
  storageBucket: "social-media-b6d4e.appspot.com",
  messagingSenderId: "25453923718",
  appId: "1:25453923718:web:3ad0dab42f5f97da433007",
  measurementId: "G-7C0JXD3L94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//tell firebase we have a authentication in our project
export const auth=getAuth(app);
export const provider = new GoogleAuthProvider();
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);