//Firebase startup/get its shit
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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

//html elements
//buttons
const signInEmail = document.getElementById("signInEmail");
const signInPassword = document.getElementById("signInPassword");
const signInButton = document.getElementById("signInButton");
const signInButtonLoading = document.getElementById("signInButtonLoading");
//error message
const signInError = document.getElementById("errorMessage");

//sign in button
signInButton.addEventListener('click', function() {
  login(auth);
  
});
  
  // set email and password variables
  var email = signInEmail.value;
  var password = signInPassword.value;

//execute login with Firebase
function login(auth) {
  signInButtonLoading.style.display = 'block';
  signInError.style.display = 'none';
  var email = signInEmail.value;
  var password = signInPassword.value;

	console.log(auth);
  signInWithEmailAndPassword(auth, email, password)
    .then(function () {
      window.location.replace('./myaccount');
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Error code hi: ' + errorCode);
      console.log('Error message: ' + errorMessage);
      signInButtonLoading.style.display = 'none';
      signInError.innerText = errorMessage;
      signInError.style.display = 'block';
    });
}


  // Get the input field
var signInPassword = document.getElementById("signInPassword");

// Execute a function when the user presses a key on the keyboard
signInPassword.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Trigger the button element with a click
    signInButton.click();
  }
});
