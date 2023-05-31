//import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";

// Firebase API
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

//variables
let currentPath = window.location.pathname;

//html ids
//nav button ids
let faqLink = document.getElementById('faqLink');
let notSignedSchedule = document.getElementById('notSignedSchedule');
let signUp = document.getElementById('signUp');
let accountPageLink = document.getElementById('accountPageLink');
let logOut = document.getElementById('logOut');
let logInButton = document.getElementById('logInButton');
let scheduleAppointmentButton = document.getElementById('scheduleAppointmentButton');

//pages hidden when user ISN'T signed in
let privatePages = [
 '/myaccount',
  '/scheduleservice'
];

//pages hidden when user IS signed in
let publicPages = [
  '/signup1',
  '/signin',
];

//function called whenever authentication state changes
// auth.onAuthStateChanged( function () {
//   checkUserStatus();
// });

//check if user is signed in when page loads
checkUserStatus();

//function to check if user is signed in
function checkUserStatus() {
  let user = auth;
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
          window.location.replace('/signup1');
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
}

//logout function
logOut.addEventListener('click', logout);
function logout() {
  auth.signOut();
  window.location.replace('/');
}

//faq nav link
faqLink.addEventListener('click', faqNav);
function faqNav() {
  window.location.replace('/#FAQs');
}
