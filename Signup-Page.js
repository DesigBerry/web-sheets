//Firebase startup/get its shit
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

//sign up info variables
let email;
let name;
let password;
let passwordConfirm;
let number;
let city;
let state;
let year;
let make;
let model;

//car model arrays
let audiOptions = ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "R8", "RS 5", "S4"];
let bmwOptions = ["2 Series", "3 Series", "5 Series", "7 Series", "M3", "X1", "X3", "X5", "X7", "Z4"];
let chevyOptions = ["Blazer", "Colorado", "Cruze", "Equinox", "Impala", "Malibu", "Silverado", "Sonic", "Trax", "Traverse"];
let chryslerOptions = ["200", "300", "Aspen", "Cirrus", "Crossfire", "Pacifica", "PT Cruiser", "Sebring", "Town & Country", "Voyager"];
let dodgeOptions = ["Avenger", "Caliber", "Challenger", "Charger", "Dart", "Durango", "Grand Caravan", "Journey", "Nitro", "Ram"];
let fordOptions = ["Edge", "Escape", "Expedition", "Explorer", "F-150", "Fiesta", "Focus", "Fusion", "Mustang", "Taurus"];
let gmcOptions = ["Acadia", "Canyon", "Envoy", "Jimmy", "Savana", "Sierra", "Sonoma", "Terrain", "TopKick", "Yukon"];
let hondaOptions = ["Accord", "Civic", "CR-V", "Fit", "HR-V", "Insight", "Odyssey", "Passport", "Pilot", "Ridgeline"];
let hyundaiOptions = ["Accent", "Elantra", "Ioniq", "Kona", "Nexo", "Palisade", "Sante Fe", "Sonata", "Tucson", "Veloster"];
let jeepOptions = ["Cherokee", "Commander", "Compass", "Gladiator", "Grand Cherokee", "Grand Wagoneer", "Liberty", "Patriot", "Renegade", "Wrangler"];
let kiaOptions = ["Forte", "K5", "Optima", "Rio", "Sedona", "Sorento", "Soul", "Sportage", "Stinger", "Telluride"];
let mercedesOptions = ["A-Class", "AMG GT", "C-Class", "CLA-Class", "E-Class", "GLE", "GLB", "GLC", "S-Class", "SL-Class"];
let nissanOptions = ["Altima", "Armada", "Frontier", "Maxima", "Murano", "Pathfinder", "Rogue", "Sentra", "Titan", "Versa"];
let subaruOptions = ["Ascent", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "WRX", "XV Crosstrek"];
let toyotaOptions = ["4Runner", "Camry", "Corolla", "Highlander", "Prius", "RAV4", "Sienna", "Tacoma", "Tundra", "Yaris"];
let emptyOptions = ["Car Model"];
//car make array
let makeOptions = ["Car Make", "Audi", "BMW", "Chevy", "Chrysler", "Dodge", "Ford", "GMC", "Honda", "Hyundai", "Jeep", "Kia", "Mercedes-Benz", "Nissan", "Subaru", "Toyota"];

//javascript variables
let makeChoice;
let form1Data;
let userInfo;

//html IDs
//form buttons
const signUpButton1 = document.getElementById("signUpButton1");
const signUpButton2 = document.getElementById("signUpButton2");
//form sections
const signUpForm2 = document.getElementById("signUpForm2");
const signUpPackages = document.getElementById("signUpPackages");
const signUpStripe = document.getElementById("signUpStripe");
//button wrap (to hide it)
const buttonsWrap1 = document.getElementById("buttonsWrap1");
const buttonsWrap2 = document.getElementById("buttonsWrap2");
//car make form field
const signUpCarMake = document.getElementById("signUpCarMake");
const signUpCarModel = document.getElementById("signUpCarModel");
//package buttons
const carHealthButton = document.getElementById("carHealthButton");
const carCarButton = document.getElementById("carCarButton");
const carMonitoringButton = document.getElementById("carMonitoringButton");
//package selection popups
const carHealthPopUp = document.getElementById("carHealthPopUp");
const carCarePopUp = document.getElementById("carCarePopUp");
const carMonitoringPopUp = document.getElementById("carMonitoringPopUp");
//package cards
const carHealthCard = document.getElementById("carHealthCard");
const carCareCard = document.getElementById("carCareCard");
const carMonitoringCard = document.getElementById("carMonitoringCard");

//set make options array (default)
for (let i = 0; i < makeOptions.length; i++) {
    var option = document.createElement("option");
    option.text = makeOptions[i];
    signUpCarMake.add(option);
}

signUpCarMake.options[0].disabled = true;

//set model option array (default)
for (let i = 0; i < emptyOptions.length; i++) {
    var option = document.createElement("option");
    option.text = emptyOptions[i];
    signUpCarModel.add(option);
}

//Grabbing information on the first form after clicking the button
signUpButton1.addEventListener('click', function (event) {
    form1Data = grabInfo1();
    console.log(form1Data);
});

//Grabbing information on the second form after clicking the button
signUpButton2.addEventListener('click', function (event) {
    grabInfo2();
});

//When Car Make selection changes
signUpCarMake.addEventListener("change", (event) => {
    makeChoice = event.target.value;

    //remove previous car model selection
    for (let i = signUpCarModel.length; i > 0; i--) {
        signUpCarModel.remove(signUpCarModel[i]);
    }



    //switch car models when make is changed
    switch (makeChoice) {
        //Audi switch function
        case "Audi":
            for (let i = 0; i < audiOptions.length; i++) {
                var option = document.createElement("option");
                option.text = audiOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //BMW switch function
        case "BMW":
            for (let i = 0; i < bmwOptions.length; i++) {
                var option = document.createElement("option");
                option.text = bmwOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //Chevy switch function
        case "Chevy":
            for (let i = 0; i < chevyOptions.length; i++) {
                var option = document.createElement("option");
                option.text = chevyOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //Chrysler switch function
        case "Chrysler":
            for (let i = 0; i < chrylserOptions.length; i++) {
                var option = document.createElement("option");
                option.text = chrylserOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //Dodge switch function
        case "Dodge":
            for (let i = 0; i < dodgeOptions.length; i++) {
                var option = document.createElement("option");
                option.text = dodgeOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //Ford switch function
        case "Ford":
            for (let i = 0; i < fordOptions.length; i++) {
                var option = document.createElement("option");
                option.text = fordOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //GMC switch function
        case "GMC":
            for (let i = 0; i < gmcOptions.length; i++) {
                var option = document.createElement("option");
                option.text = gmcOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //Honda switch function
        case "Honda":
            for (let i = 0; i < hondaOptions.length; i++) {
                var option = document.createElement("option");
                option.text = hondaOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //Hyundai switch function
        case "Hyundai":
            for (let i = 0; i < hyundaiOptions.length; i++) {
                var option = document.createElement("option");
                option.text = hyundaiOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //Jeep switch function
        case "Jeep":
            for (let i = 0; i < jeepOptions.length; i++) {
                var option = document.createElement("option");
                option.text = jeepOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //Kia switch function
        case "Kia":
            for (let i = 0; i < kiaOptions.length; i++) {
                var option = document.createElement("option");
                option.text = kiaOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //Mercedes-Benz switch function
        case "Mercedes-Benz":
            for (let i = 0; i < mercedesOptions.length; i++) {
                var option = document.createElement("option");
                option.text = mercedesOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //Nissan switch function
        case "Nissan":
            for (let i = 0; i < nissanOptions.length; i++) {
                var option = document.createElement("option");
                option.text = nissanOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //Toyota switch function
        case "Toyota":
            for (let i = 0; i < toyotaOptions.length; i++) {
                var option = document.createElement("option");
                option.text = toyotaOptions[i];
                signUpCarModel.add(option);
            }
            break;

        //default(empty) switch function
        default:
            for (let i = 0; i < emptyOptions.length; i++) {
                var option = document.createElement("option");
                option.text = emptyOptions[i];
                signUpCarModel.add(option);
            }

    }
});

//grab the information when form is submitted
function grabInfo1() {
    email = document.getElementById("signUpEmail");
    name = document.getElementById("signUpName");
    password = document.getElementById("signUpPassword");
    passwordConfirm = document.getElementById("signUpPasswordConfirm");
    number = document.getElementById("signUpNumber");
    city = document.getElementById("signUpCity");
    state = document.getElementById("signUpState");

    //show next form and hide the button on prev form
    if (email && name && password && passwordConfirm && city && state) {
        signUpForm2.style.opacity = '100%';
        buttonsWrap1.style.opacity = '0%';
        signUpForm2.style.display = 'block';
        buttonsWrap1.style.display = 'none';
    }

    //put grabbed info in an array and return it
    let formData = [email.value, name.value, city.value, state.value]
    return formData;
}

//grab the information when form is submitted
async function grabInfo2() {
    year = document.getElementById("signUpCarYear");
    make = document.getElementById("signUpCarMake");
    model = document.getElementById("signUpCarModel");

    //show next form and hide the button on prev form
    if (year && make && model) {
        signUpPackages.style.opacity = '100%';
        signUpStripe.style.opacity = '100%';
        buttonsWrap2.style.opacity = '0%';
        signUpPackages.style.display = 'block';
        signUpStripe.style.display = 'block';
        buttonsWrap2.style.display = 'none';
        console.log("visual on");
    }

    //put grabbed info in an array and return it
    let formData = [year.value, make.value, model.value]

    //combine first and second array of user data in forms
    let userInfo = form1Data.concat(formData);

    //create account in Firebase
    const capitalizedEmail = email.value.charAt(0).toUpperCase() + email.value.slice(1);
    let user = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log("user", user);
//     let userId = user.user.uid;
//     const termAgree = false;
//     const subscription = "None";
//     const bioId = false;
//     const image = "";
//     const imageFile = "";
//     const carData = {
//         make: make.value,
//         model: model.value,
//         carYear: year.value,
//         air: { airGrade: "A", airValue: 100 },
//         tires: { tireGrade: "A", tireValue: 100 },
//         cabin: { cabinGrade: "A", cabinValue: 100 },
//         brakes: { brakeGrade: "A", brakeValue: 100 },
//         rotor: { rotorGrade: "A", rotorValue: 100 },
//         oil: { oilGrade: "A", oilValue: 100 }
//     };
//     console.log("db", db);
//     console.log("userid", userId);
//     let customerRecord = {
//         email: capitalizedEmail,
//         firstName: name.value,
//         phoneNumber: number.value,
//         city: city.value,
//         state: state.value,
//         userId,
//         termAgree,
//         subscription,
//         carData,
//         bioId,
//         image,
//         imageFile,
//     };
//     db
//       .collection("Clients")
//       .doc(userId)
//       .set(customerRecord, { merge: true });

    console.log("submitted");
}
