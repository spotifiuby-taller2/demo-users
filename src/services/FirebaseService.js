const firebase = require('firebase/app');
const Constants = require('../others/constants');

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const Firebase = firebase.initializeApp(Constants.FIREBASE_CONFIG);

module.exports = Firebase;
