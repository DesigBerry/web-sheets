//Firebase startup/get its shit
import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
//error messages
const emailErrorMessage = document.getElementById("emailErrorMessage");
const nameErrorMessage = document.getElementById("nameErrorMessage");
const passErrorMessage = document.getElementById("passErrorMessage");
const passwordErrorMessage = document.getElementById("passwordErrorMessage");
const numberErrorMessage = document.getElementById("numberErrorMessage");
const cityErrorMessage = document.getElementById("cityErrorMessage");
const stateErrorMessage = document.getElementById("stateErrorMessage");
const yearErrorMessage = document.getElementById("yearErrorMessage");
const makeErrorMessage = document.getElementById("makeErrorMessage");
const modelErrorMessage = document.getElementById("modelErrorMessage");

//set make options array (default)
for (let i = 0; i < makeOptions.length; i++) {
    var option = document.createElement("option");
    option.text = makeOptions[i];
    signUpCarMake.add(option);
}

//set model option array (default)
for (let i = 0; i < emptyOptions.length; i++) {
    var option = document.createElement("option");
    option.text = emptyOptions[i];
    signUpCarModel.add(option);
}

//disabling the "Car Make" option
signUpCarMake.options[0].disabled = true;
signUpCarMake.options[0].value = "";

//disabling the "Car Model" option
signUpCarModel.options[0].disabled = true;
signUpCarModel.options[0].value = "";

//Grabbing information on the first form after clicking the button
signUpButton1.addEventListener('click', function (event) {
    form1Data = grabInfo1();
});

//create user in Firebase
signUpButton2.addEventListener('click', async function (event) {
    await createUser();
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

//form vadilation function
function validateForm(x, y) {
  if (x.value == "") {
    //show error message & red outline
    y.style.display = 'block';
    x.style.border = "#f06868 solid 3px";
  }
  else {
    //hide error message & red outline
    y.style.display = 'none';
    x.style.border = "#f06868 solid 0px";
  }
}

//grab the information when form is submitted
async function grabInfo1() {
    email = document.getElementById("signUpEmail");
    name = document.getElementById("signUpName");
    password = document.getElementById("signUpPassword");
    passwordConfirm = document.getElementById("signUpPasswordConfirm");
    number = document.getElementById("signUpNumber");
    city = document.getElementById("signUpCity");
    state = document.getElementById("signUpState");
    
    //validate that forms are filled out
    validateForm(email, emailErrorMessage);
    validateForm(name, nameErrorMessage);
    validateForm(password, passErrorMessage);
    validateForm(passwordConfirm, passwordErrorMessage);
    validateForm(number, numberErrorMessage);
    validateForm(city, cityErrorMessage);
    validateForm(state, stateErrorMessage);
    //show next form and hide the button on prev form and make sure all fields are filled out
    if (email.value && name.value && password.value && passwordConfirm.value && number.value && city.value && state.value) {
        //password and confirm password match
        if (password.value == passwordConfirm.value) {
            //display next form
            signUpForm2.style.display = 'block';
            buttonsWrap1.style.display = 'none';
            //hide error message
            passwordErrorMessage.style.display = 'none';
        }
        else {
            //show error message
            passwordErrorMessage.style.display = 'block';
        }
    }

    //put grabbed info in an array and return it
    let formData = [email.value, name.value, number.value, city.value, state.value];
    let formMessage = {"email":email.value,"firstname":name.value,"number":number.value,"city":city.value,"state": state.value}; 
    console.log("Form message: ", formMessage);
    
    
        const response = await fetch(`https://us-central1-openbayautos.cloudfunctions.net/createHubSpotContact?data='{"firstname":${name.value},"email":${email.value}, "number":${number.value}, "city":${city.value}, "state":${state.value} }'`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
    return formData;
}

//grab the information & create account in Firebase
async function createUser() {
    year = document.getElementById("signUpCarYear");
    make = document.getElementById("signUpCarMake");
    model = document.getElementById("signUpCarModel");

    //validate that forms are filled out
    validateForm(year, yearErrorMessage);
    validateForm(make, makeErrorMessage);
    validateForm(model, modelErrorMessage);
    //create user account
    if (year.value && (make.value != 'Car Make' && model.value != 'Car Model')) {
        
        //put grabbed info in an array and return it
        let formData = [year.value, make.value, model.value]

        //combine first and second array of user data in forms
        let userInfo = form1Data.concat(formData);

        //create account in Firebase
        let user = await createUserWithEmailAndPassword(auth, email.value, password.value);
        //merge customer info w/ Firebase account
        const userRef = doc(db, 'Clients', user.user.uid);
        //create and fill out basic info
        let userId = user.user.uid;
        const termAgree = false;
        const subscription = "None";
        const bioId = false;
        const image = "";
        const imageFile = "";
        const carData = {
            make: make.value,
            model: model.value,
            carYear: year.value,
            air: { airGrade: "A", airValue: 100 },
            tires: { tireGrade: "A", tireValue: 100 },
            cabin: { cabinGrade: "A", cabinValue: 100 },
            brakes: { brakeGrade: "A", brakeValue: 100 },
            rotor: { rotorGrade: "A", rotorValue: 100 },
            oil: { oilGrade: "A", oilValue: 100 }
        };
        console.log("db", db);
        //fill out form info
        setDoc(userRef, { 
            email: capitalizedEmail,
            firstName: name.value,
            lastName: "",
            phoneNumber: number.value,
            city: city.value,
            state: state.value,
            userId: userId,
            termAgree: termAgree,
            subscription: subscription,
            carData: carData,
            bioId: bioId,
            image: image,
            imageFile: imageFile,
        }, { merge: true });


        //grab userId
        const q = query(collection(db, "Clients"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        console.log("quearySnapshot", querySnapshot);
        
        //go to subscribe page
        window.location.href = "/subscribe";

      }
}
