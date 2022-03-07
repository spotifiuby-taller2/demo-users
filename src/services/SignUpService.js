const Firebase = require("../services/FirebaseService");
const FirebaseAuth = require("firebase/auth");
const constants = require('../others/constants');
const utils = require("../others/utils");
const NonActivatedUsers = require("../data/NonActivatedUsers");
const Users = require("../data/Users");
const { sendConfirmationEmail } = require('../services/MailService');

class SignUpService {
    defineEvents(app) {
    app.post( constants.SIGN_UP_URL,
              this.handleSignUp
                  .bind(this) );

    app.get( constants.SIGN_UP_END_URL + '/:userId',
             this.createVerifiedUser
                 .bind(this) );
  }

  async createVerifiedUser(req,
                           res) {
      console.log(constants.SIGN_UP_END_URL + '/:userId');

      const userId = req.params
                        .userId;

      const tempUser = await NonActivatedUsers.findOne( {
          where: {
              id : userId
          }
      } );

      if (tempUser === null) {
          utils.setErrorResponse("Link de confirmación inválido.", res);
          return;
      }

      const auth = FirebaseAuth.getAuth(Firebase.Firebase);

      FirebaseAuth.createUserWithEmailAndPassword(auth,
                                                  tempUser.email,
                                                  tempUser.password)
          .then(async function(response) {
                  const user = response.user;

                  const responseBody = {
                      token: user.accessToken
                  }

                  await Users.create( {
                      id: user.uid,
                      email: tempUser.email,
                      password: tempUser.password
                  } );

                  await NonActivatedUsers.destroy( {
                      where: {
                          id : userId
                      }
                  } )

                  res.status(200)
                     .json(responseBody);
              } )
          .catch(error => {
              utils.setErrorResponse(error, res);
          } );
  }

  async handleSignUp(req,
                     res) {
    console.log(constants.SIGN_UP_URL);

    const { email, password } = req.body;

    const auth = FirebaseAuth.getAuth(Firebase.Firebase);

    const id = utils.getId();

    const user = await Users.findOne({
                                      where: {
                                        email: email
                                      }
                                    } );

    if (user !== null) {
        utils.setErrorResponse("User already exists.",
                                res);
        return;
    }

    await NonActivatedUsers.create( {
        id: id,
        email: email,
        password: utils.getBcryptOf(password)
    } ).catch(error => {
        utils.setErrorResponse(error,
                               res);
    } );

    if (res.statusCode === 400) {
        return;
    }

    const signUpUrl = `${constants.BACKOFFICE_HOST}${constants.SIGN_UP_END_URL}/${id}`;

    try {
        sendConfirmationEmail(email, signUpUrl);

        utils.setBodyResponse(res,
                              200,
                              "Correo enviado");
    } catch(error) {
        utils.setErrorResponse(error,
                              res);
    }
  }
}

module.exports = { SignUpService };
