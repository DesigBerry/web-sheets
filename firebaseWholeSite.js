import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbkzuOmJcqTgfJyf2fbdciEeP59oJu0jY",
  authDomain: "openbayautos.firebaseapp.com",
  projectId: "openbayautos",
  storageBucket: "openbayautos.appspot.com",
  messagingSenderId: "244689157595",
  appId: "1:244689157595:web:3a6c5650962e5a9eabbbfe",
  measurementId: "G-36YCSJZJEN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

//html ids
//nav button ids
let notSignedSchedule = document.getElementById('notSignedSchedule');
let signUp = document.getElementById('signUp');
let accountPageLink = document.getElementById('accountPageLink');
let logOut = document.getElementById('logOut');
let logInButton = document.getElementById('logInButton');
let scheduleAppointmentButton = document.getElementById('scheduleAppointmentButton');

//pages hidden when user ISN'T signed in
var privatePages = [
 '/myaccount',
  '/scheduleservice'
];

//pages hidden when user IS signed in
var publicPages = [
  '/signup1',
  '/signin',
];

console.log("signUp", signUp);

//function called whenever something happens with "auth"
auth.onAuthStateChanged( function (user) {
  var currentPath = window.location.pathname;
  if (user) {
      // User is signed in.
      if (publicPages.includes(currentPath)) {
          window.location.replace('/myaccount');
      } else {
          console.log('User is logged in!');
          console.log('Email: ' + user.email);
          console.log('UID: ' + user.uid);
          loadingScreen.style.display = 'none';
          // New Home links
          notSignedSchedule.style.display = 'none';
          signUp.style.display = 'none';
          logInButton.style.display = 'none';

      }
  } else {
      // User is signed out.
      if (privatePages.includes(currentPath)) {
          window.location.replace('/home');
      } else {
          console.log('No user is logged in');
          loadingScreen.style.display = 'none';
          // New home links
          accountPageLink.style.display = 'none';
          logOut.style.display = 'none';
          scheduleAppointmentButton.style.display = 'none';
          notSignedSchedule.style.display = 'block';
          signUp.style.display = 'block';
          logInButton.style.display = 'block';

      }
  }
});

logOut.addEventListener('click', logout);
function logout() {
  auth.signOut();
}
