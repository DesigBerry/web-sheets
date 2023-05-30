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
const forgotPassEmail = document.getElementById("forgotPassEmail");
const forgotPassButton = document.getElementById("forgotPassButton");
//success & error messages
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");
//forgot password form
const forgotPasswordForm = document.getElementById("forgotPasswordForm");

//set variables
let email = forgotPassEmail.value;

//reset password button
forgotPassButton.addEventListener('click', function(event) {                        
    //password reset function
    sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("password should be sent")
                alert('Check your email for password reset!');
                forgotPasswordForm.style.display ='none';
                errorMessage.style.display ='none';
                successMessage.style.display ='block';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage2 = error.message;
                console.log(errorMessage2);
                alert('Problem with sending reset email :(');
                forgotPasswordForm.style.display ='none';
                errorMessage.style.display ='block';
                successMessage.style.display ='none';
                // ..
            });
});
