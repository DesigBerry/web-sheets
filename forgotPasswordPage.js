//Firebase startup/get its shit
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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
const forgotPassButton = document.getElementById("forgotPassButton");
//success & error messages
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
//forgot password form
const forgotPasswordForm = document.getElementById("forgotPasswordForm");

//set variables
let email = document.getElementById("forgotPassEmail");

//reset password button
forgotPassButton.addEventListener('click', function(event) {      
    forgotPassSend();
});

//password reset function
async function forgotPassSend() { 
    console.log("email in da function", email.value);
    sendPasswordResetEmail(auth, email.value)
        .then(() => {
            forgotPasswordForm.style.display ='none';
            errorMessage.style.display ='none';
            successMessage.style.display ='block';
        })
        .catch((error) => {
            console.log("error", error);
            forgotPasswordForm.style.display ='block';
            errorMessage.style.display ='block';
            successMessage.style.display ='none';
        });
}
