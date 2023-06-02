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

//user info variables
let stripeId;
let email;
let name;
let number;
let city;
let state;
let carYear;
let carMake;
let carModel;
let subPackage;
let docData;
let priceId;

//edit info variable
let cantEdit = true;

//html Ids
//buttons
const accountInfoEditInfo = document.getElementById("accountInfoEditInfo");
const accountInfoSave = document.getElementById("accountInfoSave");
//form fields
const userEmail = document.getElementById("userEmail");
const userName = document.getElementById("userName");
const userNumber = document.getElementById("userNumber");
const userCity = document.getElementById("userCity");
const userState = document.getElementById("userState");
const userCarYear = document.getElementById("userCarYear");
const userCarMake = document.getElementById("userCarMake");
const userCarModel = document.getElementById("userCarModel");

//get user information doc from Firebase
auth.onAuthStateChanged(async function (user) {
    const docRef = doc(db, "Clients", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      docData = docSnap.data();
      let carData = docData["carData"];
      
      stripeId = docData["stripeId"];
      email = docData["email"];
      name = docData["firstName"];
      number = docData["phoneNumber"];
      city = docData["city"];
      state = docData["state"];
      carYear = carData["carYear"];
      carMake = carData["make"];
      carModel = carData["model"];
      subPackage = docData["subscription"];
      
      userEmail.value = email;
        userEmail.disabled = cantEdit;
      userName.innerText = name;
        userName.disabled = cantEdit;
      userNumber.value = number;
        userNumber.disabled = cantEdit;
      userCity.value = city;
        userCity.disabled = cantEdit;
      userState.value = state;
        userState.disabled = cantEdit;
      userCarYear.value = carYear;
        userCarYear.disabled = cantEdit;
      userCarMake.value = carMake;
        userCarMake.disabled = cantEdit;
      userCarModel.value = carModel;
        userCarModel.disabled = cantEdit;
    } 
    else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
});

//turn on the ability to type in form field
accountInfoEditInfo.addEventListener('click', function(event) {
    cantEdit = !cantEdit;
});

//turn off the ability to type in form field
accountInfoSave.addEventListener('click', function(event) {
    cantEdit = !cantEdit;
});
