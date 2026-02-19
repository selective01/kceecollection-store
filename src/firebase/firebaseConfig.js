// Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBEVm0IG2FFIBe9m7V1QuE21lSt7wyJfRI",
  authDomain: "kceecollection-72032.firebaseapp.com",
  projectId: "kceecollection-72032",
  storageBucket: "kceecollection-72032.appspot.com",
  messagingSenderId: "102701466324",
  appId: "1:102701466324:web:938d56001da334e3bff141"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
