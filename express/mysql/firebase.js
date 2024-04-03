const fireBase = require("firebase/app");
const fireStore = require("firebase/firestore");


const firebaseConfig = {
  apiKey: "AIzaSyADNMUBetc6oXhm-i3CimTIiBTmMbZlQng",
  authDomain: "ris-webapp.firebaseapp.com",
  projectId: "ris-webapp",
  storageBucket: "ris-webapp.appspot.com",
  messagingSenderId: "172945232686",
  appId: "1:172945232686:web:6c719bf86bf14ebd16a0bf",
  measurementId: "G-J3V6E20NHN",

};

const app = fireBase.initializeApp(firebaseConfig);
const firestoreDB = fireStore.getFirestore(app);

module.exports = firestoreDB;