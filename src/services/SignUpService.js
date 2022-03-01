const Firebase = require("../services/FirebaseService");
const FirebaseAuth = require("firebase/auth");
const Constants = require('../others/constants');

class SignUpService {

  defineEvents(app) {
    app.post( Constants.SIGN_UP_URL, this.handleSignUp
                                         .bind(this) );
  }

  handleSignUp(req,
               res) {
    const { email, password } = req.body;

    const auth = FirebaseAuth.getAuth(Firebase.Firebase);

    FirebaseAuth.createUserWithEmailAndPassword(
        auth,
        email,
        password
    ).then(response  => {
      const user = response.user;

      const responseBody = {
        uid: user.uid,
        token: user.accessToken
      }

      res.status(200)
         .json(responseBody);
      }
    ).catch(error => {
        const responseBody = {
            error: error.toString()
        }

        res.status(400)
            .json(responseBody);
      }
    );
  }
}

module.exports = { SignUpService };
