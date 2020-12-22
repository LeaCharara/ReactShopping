import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyCYjvs1UCAE-aiF3NOYh6Aqy0AXdCTMlaY",
  authDomain: "reactshopping-de6e4.firebaseapp.com",
  databaseURL: "https://reactshopping-de6e4.firebaseio.com",
  projectId: "reactshopping-de6e4",
  storageBucket: "reactshopping-de6e4.appspot.com",
  messagingSenderId: "932781287371",
  appId: "1:932781287371:web:72b2349fe355f3a26d384e",
  measurementId: "G-PGX36S9P5P"
};

firebase.initializeApp(firebaseConfig)

export default firebase
export const auth = firebase.auth();
export const firestore = firebase.firestore();