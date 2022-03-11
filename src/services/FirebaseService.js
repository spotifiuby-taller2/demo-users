const firebase = require('firebase/app');
const firebaseAuth = require("firebase/auth");
const constants = require('../others/constants');

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const Firebase = firebase.initializeApp(constants.firebaseConfig);

const auth = firebaseAuth.getAuth(Firebase);

module.exports = {
    Firebase,
    auth
};
