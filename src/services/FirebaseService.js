const admin = require('firebase-admin');
const constants = require('../others/constants');

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

admin.initializeApp({
    credential: admin.credential
                     .cert(constants.firebaseJson)
});

const auth = admin.auth();

module.exports = {
    auth
};
