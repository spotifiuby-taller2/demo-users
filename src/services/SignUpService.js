const {auth} = require("../services/FirebaseService");
const constants = require('../others/constants');
const utils = require("../others/utils");
const NonActivatedUsers = require("../data/NonActivatedUsers");
const Users = require("../data/Users");
const Logger = require("./Logger");
const { areAnyUndefined } = require("../others/utils");
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
    *         "411":
    *           description: "Mail already registered."
    *
    *         "412":
    *           description: "Empty required field."

    *         "414":
    *           description: "User already signed in as external."
    * 
    *         "415":
    *           description: "Mail already sent."
    *
    *         "501":
    *           description: "Could not save user temporarily."
    *
    *         "502":
    *           description: "Could not create account."
    *
    *         "503":
    *           description: "Could not send email."
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
    *         "511":
    *           description: "Error creating user."
    */
    app.get( constants.SIGN_UP_END_URL + '/:userId',
             this.createVerifiedUser
                 .bind(this) );
  }

  async handleSignUp(req,
                       res) {
        Logger.request(constants.SIGN_UP_URL);

        const { email,
                password,
                link,
                isExternal } = req.body;

        const isAdmin = link === "web";

        if ( areAnyUndefined([email, password]) ) {
            utils.setErrorResponse("Por favor complete todos los campos.",
                                    412,
                                    res);

            return;
        }

        const id = utils.getId();

        const user = await Users.findOne({
            where: {
                email: email
            }
        } );

        if (user !== null) {
         if (user.isExternal) {
             utils.setErrorResponse("El usuario ya se ha loguedo de manera externa y ya no puede registrarse en esta aplicación",
                 414,
                 res);
         }

         else {
             utils.setErrorResponse("Ya hay un usuario con ese mail",
                 411,
                 res);
         }
            return;
        }

      const nonUser = await NonActivatedUsers.findOne({
          where: {
              email: email
          }
      } );

      if (nonUser !== null) {
          utils.setErrorResponse("Ya hay un usuario con ese mail pendiente de confirmación",
              415,
              res);

          return;
      }

        await NonActivatedUsers.create( {
            id: id,
            email: email,
            password: utils.getBcryptOf(password),
            isAdmin: isAdmin,
            isExternal: isExternal
        } ).catch(error => {
            Logger.error("No se pudo crear el usuario temporal " +  error.toString());

            utils.setErrorResponse("Error al intentar crear la cuenta.",
                502,
                res);
        } );

        if (res.statusCode >= 400) {
            return;
        }

        try {
            if (isAdmin) {
                await sendConfirmationEmail(email,
                    `${constants.BACKOFFICE_HOST}${constants.SIGN_UP_END_URL}/${id}`);
            } else {
                await sendConfirmationEmail(email,
                    `${constants.AUTH_FRONT}${constants.SIGN_UP_END_URL}/${id}`);
            }

            Logger.info("Correo enviado");

            utils.setBodyResponse({result: "Correo enviado a tu cuenta."},
                                    201,
                                    res);
        } catch(error) {
            utils.setErrorResponse("No se pudo enviar el correo a la cuenta indicada.",
                                    503,
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

      const response = await auth.createUser( {
          email: tempUser.email,
          emailVerified: true,
          password: tempUser.password,
          disabled: false
          } )
          .catch(error => {
              return { error: error.toString() }
          } );

      if (response.error !== undefined) {
          Logger.error(error.toString());

          utils.setErrorResponse(error,
              511,
              res);

          return;
      }


      const responseBody = {
          token: response.accessToken
      }

      await Users.create( {
          id: response.uid,
          email: tempUser.email,
          password: tempUser.password,
          isAdmin: tempUser.isAdmin,
          isBlocked: false,
          isExternal: tempUser.isExternal
      } );

      await NonActivatedUsers.destroy( {
          where: {
              id : userId
          }
      } );

      Logger.info("Usuario creado");

      res.status(201)
         .json(responseBody);

  }
}

module.exports = SignUpService;
