//Firebase startup/get its shit
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDoc, getDocs, query, where, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
//variables to get user info
let docData;
let docDataSub;
let priceId;
let subId;
//edit info
let cantEdit = true;
//user id
let userId;
//password
let password;

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
//password wrap, field, button & error message
const accountPassword = document.getElementById("accountPassword");
const accountPasswordWrap = document.getElementById("accountPasswordWrap");
const accountPasswordWrapBG = document.getElementById("accountPasswordWrapBG");
const passwordButton = document.getElementById("passwordButton");
const passwordError = document.getElementById("passwordError");
//loading animation, save text, & the wrap
const saveLoading = document.getElementById("saveLoading");
const loadingTire = document.getElementById("loadingTire");
const saveText = document.getElementById("saveText");
//stripe customer portal buttons
const billingInfoLink = document.getElementById("billingInfoLink");
const subInfoLink = document.getElementById("subInfoLink");



//get user information doc from Firebase
auth.onAuthStateChanged(async function (user) {
    userId = user.uid;
    const docRef = doc(db, "Clients", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
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
      userName.innerText = name;
      userNumber.value = number;
      userCity.value = city;
      userState.value = state;
      userCarYear.value = carYear;
      userCarMake.value = carMake;
      userCarModel.value = carModel;
    } 
    else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    
    //this snapshot is how we get the subscription id
    //we then store it in the global variable
    const subSnapshot = await getDocs(collection(db, "Clients", userId, "subscriptions"));
    subSnapshot.forEach((doc) => {
    subId = doc.id;
    });
    //now we are getting the document that contains the subscription info
    //this is the doc inside of a doc
    const docRefSub = doc(db, "Clients", userId, "subscriptions", subId);
    const docSnapSub = await getDoc(docRefSub);
    //this checks to see if the doc exists, which is where we wanna be i think
    if (docSnapSub.exists()) {
      let subData = docSnapSub.data();
      //the flag for the update method
      let second = "second";
      //get the subscription package name
      let subName = subData["items"][0].price.product.name;
        //if the user needs to update the package name or log a package name
        if (subName != subPackage) {
          //make the api request to hubspot to update the contact
          const response = await fetch(`https://us-central1-openbayautos.cloudfunctions.net/updateHubSpotContact?email=${email}&flag=${second}&newSubscription=${subName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
          //update the firebase document to have the subscription as the correct name
          await updateDoc(doc(db, "Clients", userId), { subscription: subName });
        //if the user already has a package and didn't get a new one
        } else {
            return;
        }
    } else {
      // docSnap.data() will be undefined in this case
      //not sure what we wanna do in here but yea if this isnt there we handle it here 
      console.log("No such document!");
        return;
    }
    
});

//form field edit on/off settings
userEmail.disabled = cantEdit;
userNumber.disabled = cantEdit;
userCity.disabled = cantEdit;
userState.disabled = cantEdit;
userCarYear.disabled = cantEdit;
userCarMake.disabled = cantEdit;
userCarModel.disabled = cantEdit;

//turn on the ability to edit account info
accountInfoEditInfo.addEventListener('click', function(event) {
    //turn on password form
    accountPasswordWrap.style.display = 'block';
    accountPasswordWrapBG.style.display - 'block';
    
    //password button event listener
    passwordButton.addEventListener('click', function(event) {
        password = accountPassword.value;
        
        //start password check process
        signInWithEmailAndPassword(auth, email, password).then(user => {
            //turn off password wrap
            accountPasswordWrap.style.display = 'none';
            accountPasswordWrapBG.style.display - 'none';
            //if it makes it here, the password is correct
            cantEdit = false;
            //turn on editing for the fields
            userEmail.disabled = cantEdit;
            userNumber.disabled = cantEdit;
            userCity.disabled = cantEdit;
            userState.disabled = cantEdit;
            userCarYear.disabled = cantEdit;
            userCarMake.disabled = cantEdit;
            userCarModel.disabled = cantEdit;
            //hide error message
            passwordError.style.display = 'none';
            //hide "edit info" button & show "save"
            accountInfoEditInfo.style.display = "none";
            accountInfoSave.style.display = "block";
            
        }).catch(err => {
            //should only make it here if the password is incorrect
            console.log("There was an error " + err);
            //show error message
            passwordError.style.display = 'block';
        })
    });
});

//pressing enter while in the "password" field to edit account info
accountPassword.addEventListener("keypress", function(event){
  if (event.key === "Enter") {
      //stop the default webflow error message
      event.preventDefault();
      //submit password
      passwordButton.click();
  };
});

//clicking outside of the password box will close it
accountPasswordWrapBG.addEventListener("click", function(event){
    accountPasswordWrapBG.style.display = 'none';
});

//clicking inside of the password box prevents it from closing
accountPasswordWrap.addEventListener("click", function(event){
    //stop the default webflow error message
    event.preventDefault();
});

//save info and turn off editing
accountInfoSave.addEventListener('click', async function(event) {
    cantEdit = true;
    //turn off editing for fields
    userEmail.disabled = cantEdit;
    userNumber.disabled = cantEdit;
    userCity.disabled = cantEdit;
    userState.disabled = cantEdit;
    userCarYear.disabled = cantEdit;
    userCarMake.disabled = cantEdit;
    userCarModel.disabled = cantEdit;
    //hide "save" button, show "edit info" & turn on loading animation
    accountInfoEditInfo.style.display = "block";
    accountInfoSave.style.display = "none";
    saveLoading.style.display = 'block';
    saveLoading.style.opacity = '100%';
    loadingTire.style.display = 'block';
    saveText.style.display = 'none';
    
    //update firebase
    await updateDoc(doc(db, "Clients", userId), { email: userEmail.value, phoneNumber: userNumber.value, city: userCity.value, state: userState.value, "carData.carYear": userCarYear.value, "carData.make": userCarMake.value, "carData.model": userCarModel.value  });
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            password
        )
        const result = await reauthenticateWithCredential(
            auth.currentUser,
            credential
        )

        updateEmail(auth.currentUser, userEmail.value).then(() => {
            // account updated!
            loadingTire.style.display = 'none';
            saveText.style.display = 'block';
            //turn off loading block after 1 second
            setTimeout(finishedSaving, 2000);
        }).catch((error) => {
            // An error occurred
            // ...
            console.log("The current user: '", auth.currentUser);
            console.log("error fool, ", error);
        });
    
    //update HubSpot
    let third = 'third';
            const response = await fetch(`https://us-central1-openbayautos.cloudfunctions.net/updateHubSpotContact?email=${userEmail.value}&flag=${third}&firstname=${name}&number=${userNumber.value}&city=${userCity.value}&state=${userState.value}&newCarYear=${userCarYear.value}&newCarMake=${userCarMake.value}&newCarModel=${userCarModel.value}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
});

//stripe "billing information" portal button
billingInfoLink.addEventListener('click', async function(event) {
    window.open(`https://billing.stripe.com/p/login/14kcOP2Hvb1W53O3cc?prefilled_email=${email}`);
});

//stripe "subscription information" portal button
subInfoLink.addEventListener('click', async function(event) {
    window.open(`https://billing.stripe.com/p/login/14kcOP2Hvb1W53O3cc?prefilled_email=${email}`);
});

//function to turn off the save loading block after saving is done
function finishedSaving() {
    saveLoading.style.opacity = '0%';
    saveLoading.style.display = 'none';
};
