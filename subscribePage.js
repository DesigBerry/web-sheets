//Firebase startup/get its shit
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDoc, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

//Firebase API
const firebaseConfig = {
    apiKey: "AIzaSyBbkzuOmJcqTgfJyf2fbdciEeP59oJu0jY",
    authDomain: "openbayautos.firebaseapp.com",
    projectId: "openbayautos",
    storageBucket: "openbayautos.appspot.com",
    messagingSenderId: "244689157595",
    appId: "1:244689157595:web:3a6c5650962e5a9eabbbfe",
    measurementId: "G-36YCSJZJEN"
  };

//initialize Firebase
let app;

// Check if Firebase app has already been initialized
try {
  app = getApp();
} catch {
  app = initializeApp(firebaseConfig);
}

const analytics = getAnalytics(app);
const auth = getAuth(app);

//initialize Firestore
const db = getFirestore();
let stripeId;
let email;
let name;

//html Ids
//buttons
const carHealthButton = document.getElementById("carHealthButton");

//get user information doc from Firebase
auth.onAuthStateChanged(async function (user) {
    const docRef = doc(db, "Clients", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      let docData = docSnap.data();
      stripeId = docData["stripeId"];
      email = docData["email"];
      name = docData["firstName"];
      console.log("stripeId", stripeId);
      console.log("email", email);
      console.log("name", name);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
   }
});

//car health button
carHealthButton.addEventListener('click', function (event) {
    //window.location.href = `https://buy.stripe.com/test_fZebJW8OneA5dDq8wx?prefilled_email=${email}&client_reference_id=${stripeId}`;
    console.log("link", `https://buy.stripe.com/test_fZebJW8OneA5dDq8wx?prefilled_email=${email}&client_reference_id=${stripeId}`);
});
