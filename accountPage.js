//Firebase startup/get its shit
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
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

//user id variable
let userId;

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
    console.log("Sub ID: ", subId);
    });
    //now we are getting the document that contains the subscription info
    //this is the doc inside of a doc
    const docRefSub = doc(db, "Clients", userId, "subscriptions", subId);
    const docSnapSub = await getDoc(docRefSub);
    //this checks to see if the doc exists, which is where we wanna be i think
    if (docSnapSub.exists()) {
      let subData = docSnapSub.data();
      //the flag for the update method
      let second = 'second';
      //weird name, can be changed, but this is the name that we want
      let items = subData["items"][0].price.product.name;
      console.log("Sub items zero: ", subData["items"][0].price.product.name);
      //update the firebase document to have the subscription as the correct name
      await updateDoc(doc(db, "Clients", userId), { subscription: items });
        //make the api request to hubspot to update the contact
      const response = await fetch(`https://us-central1-openbayautos.cloudfunctions.net/updateHubSpotContact?email=${email.value}&flag=${second}&newSubscription=${items}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
    } else {
      // docSnap.data() will be undefined in this case
      //not sure what we wanna do in here but yea if this isnt there we handle it here 
      console.log("No such document!");
    }
    
//     //grab subscription id
//     const querySnapshotSub = await getDocs(collection(db, "Clients", userId, "subscriptions"));
//       querySnapshotSub.forEach((doc) => {
//       //grab the user's subscription's name
//       docDataSub = doc.data();
//       subPackage = docDataSub.items[0].price.product.name;
//       docDataSubId = doc.id;
//     });
    
//     //check subscription info
//     const colRef = collection(db, "Client", userId, "subscriptions");
//     const colRefSub = await getDocs(colRef);
//     //if the user has a subscription
//     console.log("colRefSub", colRefSub);
//     if(colRefSub.exists()) {
//         //grab the user's subscription's name
// //         docDataSub = doc.data();
// //         subPackage = docDataSub.items[0].price.product.name;
//         console.log("it exists");
//     //if the user doesn't have a subscription
//     } else {
//         console.log("it doesn't exist")
//     };
    
});

//form field edit on/off settings
userEmail.disabled = cantEdit;
userNumber.disabled = cantEdit;
userCity.disabled = cantEdit;
userState.disabled = cantEdit;
userCarYear.disabled = cantEdit;
userCarMake.disabled = cantEdit;
userCarModel.disabled = cantEdit;

//turn on the ability to type in form field
accountInfoEditInfo.addEventListener('click', function(event) {
    cantEdit = false;
    //
    userEmail.disabled = cantEdit;
    userNumber.disabled = cantEdit;
    userCity.disabled = cantEdit;
    userState.disabled = cantEdit;
    userCarYear.disabled = cantEdit;
    userCarMake.disabled = cantEdit;
    userCarModel.disabled = cantEdit;
    //hide "edit info" button & show "save"
    accountInfoEditInfo.style.display = "none";
    accountInfoSave.style.display = "block";
    
});

//turn off the ability to type in form field
accountInfoSave.addEventListener('click', async function(event) {
    cantEdit = true;
    //
    userEmail.disabled = cantEdit;
    userNumber.disabled = cantEdit;
    userCity.disabled = cantEdit;
    userState.disabled = cantEdit;
    userCarYear.disabled = cantEdit;
    userCarMake.disabled = cantEdit;
    userCarModel.disabled = cantEdit;
    //hide "save" button & show "edit info"
    accountInfoEditInfo.style.display = "block";
    accountInfoSave.style.display = "none";
    
    //update firebase
    await updateDoc(doc(db, "Clients", userId), { email: userEmail.value, phoneNumber: userNumber.value  });
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                password
            )
            const result = await reauthenticateWithCredential(
                auth.currentUser,
                credential
            )

            // TODO(you): prompt the user to re-provide their sign-in credentials
            // const credential = promptForCredentials();

            updateEmail(auth.currentUser, userEmail.value).then(() => {
                // Email updated!
                // ...
            }).catch((error) => {
                // An error occurred
                // ...
                console.log("The current user: '", auth.currentUser);
                console.log("error fool, ", error)
            });
    
});
