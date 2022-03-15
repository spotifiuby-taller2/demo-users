const {auth} = require("../services/FirebaseService");
const firebaseAuth = require("firebase/auth");
const constants = require('../others/constants');
const utils = require("../others/utils");
const NonActivatedUsers = require("../data/NonActivatedUsers");
const Users = require("../data/Users");
const Logger = require("./Logger");
const { sendConfirmationEmail } = require('../services/MailService');

class SignUpService {
  defineEvents(app) {
    /**
    * @swagger
    * /signup:
    *   post:
    *    summary: Sign up
    *
    *    description: Allow sign up.
    *
    *    parameters:
    *         - name: "email"
    *           in: body
    *           type: "string"
    *           required: true
    *
    *         - name: "password"
    *           in: body
    *           type: "string"
    *           required: true
    *
    *         - name: "link"
    *           in: body
    *           type: "string"
    *           required: true
    *
    *    responses:
    *         "201":
    *           description: "Mail to verify email sent."
    *
    *         "401":
    *           description: "Mail already registered."
    *
    *         "501":
    *           description: "Could not save user temporarily."
    */
    app.post( constants.SIGN_UP_URL,
              this.handleSignUp
                  .bind(this) );

    /**
    * @swagger
    * /signup/end/:userId:
    *   get:
    *    summary: Sign up end
    *
    *    description: Validate an email and create the user.
    *
    *    parameters:
    *         - name: "userId"
    *           in: path
    *           type: "string"
    *           required: true
    *
    *    responses:
    *         "201":
    *           description: "User created."
    *
    *         "401":
    *           description: "Invalid confirmation link."
    *
    *         "501":
    *           description: "Error creating user."
    */
    app.get( constants.SIGN_UP_END_URL + '/:userId',
             this.createVerifiedUser
                 .bind(this) );
  }

  async handleSignUp(req,
                       res) {
        Logger.request(constants.SIGN_UP_URL);

        const { email, password, link } = req.body;

        const isAdmin = link === "web";

        const id = utils.getId();

        const user = await Users.findOne({
            where: {
                email: email
            }
        } );

        if (user !== null) {
            utils.setErrorResponse("Ya hay un usuario con ese mail",
                401,
                res);
            return;
        }

        await NonActivatedUsers.create( {
            id: id,
            email: email,
            password: utils.getBcryptOf(password),
            isAdmin: isAdmin
        } ).catch(error => {
            Logger.error("No se pudo crear el usuario temporal " +  error.toString());

            utils.setErrorResponse(error,
                501,
                res);
        } );

        if (res.statusCode >= 400) {
            return;
        }


        try {
            if (isAdmin) {
                sendConfirmationEmail(email,
                    `${constants.BACKOFFICE_HOST}${constants.SIGN_UP_END_URL}/${id}`);
            } else {
                sendConfirmationEmail(email,
                    `${constants.AUTH_FRONT}${constants.SIGN_UP_END_URL}/${id}`);
            }

            utils.setBodyResponse({result: "Correo enviado"},
                201,
                res);
        } catch(error) {
            utils.setErrorResponse(error,
                501,
                res);
        }
    }

  async createVerifiedUser(req,
                           res) {
      Logger.request(constants.SIGN_UP_END_URL + '/:userId');

      const userId = req.params
                        .userId;

      const tempUser = await NonActivatedUsers.findOne( {
          where: {
              id : userId
          }
      } );

      if (tempUser === null) {
          utils.setErrorResponse("Link de confirmación inválido",
                                 401,
                                 res);
          return;
      }

      firebaseAuth.createUserWithEmailAndPassword(auth,
                                                  tempUser.email,
                                                  tempUser.password)
          .then((response) => {
                  const user = response.user;

                  const responseBody = {
                      token: user.accessToken
                  }

                  Users.create( {
                      id: user.uid,
                      email: tempUser.email,
                      password: tempUser.password,
                      isAdmin: tempUser.isAdmin,
                      isBlocked: false
                  } ).then();

                  NonActivatedUsers.destroy( {
                      where: {
                          id : userId
                      }
                  } ).then();

                  Logger.info("Usuario creado");

                  res.status(201)
                     .json(responseBody);
              } )
          .catch(error => {
              utils.setErrorResponse(error,
                                     501,
                                     res);
          } );
  }
}

module.exports = SignUpService;
