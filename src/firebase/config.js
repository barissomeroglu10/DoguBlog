// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNHqk0jVXWPtcnP8PnUlCZ1Ft_ncrHPlA",
  authDomain: "dogublog-65ea7.firebaseapp.com",
  projectId: "dogublog-65ea7",
  storageBucket: "dogublog-65ea7.appspot.com",
  messagingSenderId: "1041314220998",
  appId: "1:1041314220998:web:d013c6d02385257fe8c0c7",
  measurementId: "G-TRCCH2H4YF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { app, auth, db, storage, analytics };