import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// Your web app's Firebase configuration
const firebaseConfig  = {
  apiKey: "AIzaSyDWoCzkqMaVi0ct9v4BkhRJkUlpN7bvBOA",
  authDomain: "rzmbd-ca0b6.firebaseapp.com",
  projectId: "rzmbd-ca0b6",
  storageBucket: "rzmbd-ca0b6.firebasestorage.app",
  messagingSenderId: "117440566635",
  appId: "1:117440566635:web:b78d8fdf0ef61dd166a82e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const initBD = firebase.firestore()

export  {initBD};

// export class init{
//   firebaseConfig  = {
//     apiKey: "AIzaSyDWoCzkqMaVi0ct9v4BkhRJkUlpN7bvBOA",
//     authDomain: "rzmbd-ca0b6.firebaseapp.com",
//     projectId: "rzmbd-ca0b6",
//     storageBucket: "rzmbd-ca0b6.firebasestorage.app",
//     messagingSenderId: "117440566635",
//     appId: "1:117440566635:web:b78d8fdf0ef61dd166a82e"
//   };
//   db = firebase.initializeApp(this.firebaseConfig).firestore();
//
// }
