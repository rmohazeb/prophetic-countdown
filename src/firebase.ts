// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxK06RUFFfTCB0gq9QSYZv6jF9t_44ZIY",
  authDomain: "prophecy-timers-abf18.firebaseapp.com",
  projectId: "prophecy-timers-abf18",
  storageBucket: "prophecy-timers-abf18.firebasestorage.app",
  messagingSenderId: "95668811012",
  appId: "1:95668811012:web:72bfc9c1ba3607ffe88c51",
  measurementId: "G-KTS8V4P1WR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);