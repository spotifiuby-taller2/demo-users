const {auth} = require("../services/FirebaseService");
const constants = require('../others/constants');
const utils = require("../others/utils");
const Logger = require("./Logger");
const { areAnyUndefined } = require("../others/utils");
const { Op } = require("sequelize");
const Users = require("../data/Users");
const {sendPasswordRecoveryEmail} = require("./MailService");

class ForgotPassword {
  defineEvents(app) {
    /**
    * @swagger
    * /forgotpassword:
    *   post:
    *    summary: Forgot password
    *
    *    description: Sends email to allow password recovery.
    *
    *    parameters:
    *         - name: "email"
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
    *           description: "Mail sent to recover password."
    * 
    *         "411":
    *           descritption: "Empty fields."
    * 
    *         "412":
    *           descritption: "User does not exists."
    *
    *         "413":
    *           description: "External user"
    *
    *         "414":
    *           description: "Unauthorized"
    */
    app.post( constants.FORGOT_PASSWORD_URL,
              this.handleForgotPassword
                  .bind(this) );

      /**
       * @swagger
       * /forgotpassword/:userId:
       *   post:
       *    summary: Recover password
       *
       *    description: Allows password recovery.
       *
       *    parameters:
       *         - name: "userId"
       *           in: path
       *           type: "string"
       *           required: true
       *
       *         - name: "password"
       *           in: body
       *           type: "string"
       *           required: true
       *
       *    responses:
       *         "201":
       *           description: "Password changed."
       *
       *         "411":
       *           descritption: "Empty fields."
       *
       *         "412":
       *           descritption: "Broken link."
       *
       *         "511":
       *           descritption: "Could not update password."
       */
     app.post( constants.FORGOT_PASSWORD_URL + '/:userId',
          this.handleRecoverPassword
              .bind(this) );
  }

    async handleRecoverPassword(req, res)
    {
        const userId = req.params
                          .userId;

        const password = req.body
                            .password;

        if ( areAnyUndefined([password]) ) {
            utils.setErrorResponse("Por favor complete todos los campos.",
                411,
                res);

            return;
        }

        const user = await Users.findOne( {
            where: {
                [Op.and]:
                    [{id: userId}]
            }
        } );

        if (user === null) {
            utils.setErrorResponse("Enlace inválido.",
                412,
                res);

            return;
        }

        const response = await auth.updateUser(user.id, {
                                                email: user.email,
                                                password: password
                                            })
                                                .catch(function(error) {
                                                    return { error: error.toString() };
                                                });

        if (response.error !== undefined) {
            Logger.error(response.error);

            utils.setErrorResponse(error,
                                    501,
                                    res);

            return;
        }

        await Users.update( {
                password: hashedPassword
            }, {
                where: {
                    id: userId
                }
             } );

        Logger.info("Contraseña cambiada.");

        utils.setBodyResponse({
                result: "Se actualizó la contraseña."},
                201,
                res);
    }

    async handleForgotPassword(req, res)
   {
       const { email, link } = req.body;

       const isAdmin = link === "web";

       if ( areAnyUndefined([email]) ) {
           utils.setErrorResponse("Por favor complete todos los campos.",
                                  411,
                                  res);
           return;
       }

       const user = await Users.findOne({
           where: {
               [Op.and]:
                   [{email: email}]
           }
       });

       if (user === null) {
           utils.setErrorResponse("No se encontró ningún usuario con ese mail.",
                                   412,
                                   res);
           return;
       }

       if (user.isExternal) {
           utils.setErrorResponse("Usuario con identidad federada: " +
               "por favor utilizar el servicio externo correspondiente para recuperar la contraseña.",
               413,
               res);
           return;
       }

       if (user.isAdmin && ! isAdmin) {
           utils.setErrorResponse("Usuario no autorizado.",
               414,
               res);
           return;
       }

       if (isAdmin) {
           await sendPasswordRecoveryEmail(email,
               `${constants.BACKOFFICE_HOST}${constants.FORGOT_PASSWORD_URL}/${user.id}`);
       } else {
           await sendPasswordRecoveryEmail(email,
               `${constants.AUTH_FRONT}${constants.FORGOT_PASSWORD_URL}/${user.id}`);
       }

       Logger.info("Correo enviado.");

       utils.setBodyResponse({
               result: "Se envío un correo a la cuenta para reestablecer la contraseña."},
               201,
               res);
   }
}

module.exports = ForgotPassword;
