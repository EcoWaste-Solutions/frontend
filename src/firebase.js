// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "waste-management-b1bf3.firebaseapp.com",
  projectId: "waste-management-b1bf3",
  storageBucket: "waste-management-b1bf3.appspot.com",
  messagingSenderId: "394704107488",
  appId: "1:394704107488:web:a0f00c5641927c896fdd85"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);