import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, doc, serverTimestamp, query, orderBy, onSnapshot, getDocs, limit,where } from 'firebase/firestore';




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0-Ar66sJPeHWDgrfSlqYA-t1JzDVNnqs",
  authDomain: "helpdesk-siripong.firebaseapp.com",
  projectId: "helpdesk-siripong",
  storageBucket: "helpdesk-siripong.appspot.com",
  messagingSenderId: "658085556369",
  appId: "1:658085556369:web:172221ddcf7ac5d13c8f30",
  measurementId: "G-5W5GGDJ9CP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



const auth = getAuth(app);
const db = getFirestore(app);

// Export auth so it can be imported in other files

export { auth, db, collection, addDoc, updateDoc, doc, serverTimestamp, query, orderBy,  onSnapshot, getDocs,limit,where};
