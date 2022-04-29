const {auth} = require("../services/FirebaseService");
const constants = require('../others/constants');
const utils = require("../others/utils");
const Logger = require("./Logger");
const { areAnyUndefined } = require("../others/utils");
const { Op } = require("sequelize");
const {Users} = require("../data/Users");
const RecoveryRequests = require("../data/RecoveryRequest");
const {getDateTimeFromDatabaseTimestamp} = require("../others/utils");
const {getDateTimeMinus} = require("../others/utils");
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
    *         "200":
    *           description: "Mail sent to recover password."
    * 
    *         "461":
    *           descritption: "Empty fields."
    * 
    *         "462":
    *           descritption: "User does not exists."
    *
    *         "463":
    *           description: "External user"
    *
    *         "464":
    *           description: "Unauthorized"
    *
    *         "561":
    *           description: "Database error."
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
       *         "200":
       *           description: "Password changed."
       *
       *         "461":
       *           descritption: "Empty fields."
       *
       *         "462":
       *           descritption: "Broken link."
       *
       *         "561":
       *           descritption: "Could not update password."
       */
     app.post( constants.FORGOT_PASSWORD_URL + '/:userId',
          this.handleRecoverPassword
              .bind(this) );
  }

    async handleRecoverPassword(req, res) {
        Logger.info("Request a " + constants.FORGOT_PASSWORD_URL);

        const userId = req.params
                          .userId;

        const password = req.body
                            .password;

        const user = await Users.findOne( {
            where: {
                [Op.and]:
                    [{id: userId}]
            }
        } );

        const request = await RecoveryRequests.findOne( {
            where: {
                userId: userId
            }
        } ).catch(error => {
            return error.toString();
        } );

        if (user === null || request === null) {
            utils.setErrorResponse("Enlace inválido.",
                462,
                res);

            return;
        }

        const now = new Date();

        const differentDates = request.createdAt
                                      .getDate() !== now.getDate();

        const timeDifference = now.getTime() - request.createdAt
                                                      .getTime();

        if (differentDates
            || timeDifference > constants.ONE_HOUR_DIFFERENCE) {
            utils.setErrorResponse("Enlace expirado.",
                462,
                res);

            return;
        }

        if ( areAnyUndefined([password]) ) {
            utils.setErrorResponse("Por favor complete todos los campos.",
                461,
                res);

            return;
        }

        const response = await auth.updateUser(user.id, {
                                                password: password
                                            })
                                                .catch(function(error) {
                                                    return { error: error.toString() };
                                                });

        if (response.error !== undefined) {
            Logger.error(response.error);

            utils.setErrorResponse(error,
                                    561,
                                    res);

            return;
        }

        const updateResponse = await Users.update( {
                password: password
            }, {
                where: {
                    id: userId
                }
             } ).catch(error => {
                 return error.toString();
        } );

        const destroyResponse = await RecoveryRequests.destroy( {
            where: {
                userId: user.id
            }
        } ).catch(error => {
            return error.toString();
        } );

        if (updateResponse.length !== 1
            || destroyResponse !== 1) {
            Logger.error("No se pudo quitar el link de recuperación.");

            utils.setErrorResponse("No se pudo cambiar la contraseña.",
                561,
                res);

            return;
        }

        Logger.info("Se actualizó la contraseña.");

        utils.setBodyResponse({
                result: "Se actualizó la contraseña."},
                200,
                res);
    }

    async handleForgotPassword(req, res) {
       Logger.info("Request a " + constants.FORGOT_PASSWORD_URL + '/:userId');

       const { email, link } = req.body;

       const isAdmin = link === "web";

       if ( areAnyUndefined([email]) ) {
           utils.setErrorResponse("Por favor complete todos los campos.",
                                  461,
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
                                   462,
                                   res);
           return;
       }

       if (user.isExternal) {
           utils.setErrorResponse("Usuario con identidad federada: " +
               "por favor utilizar el servicio externo correspondiente para recuperar la contraseña.",
               463,
               res);
           return;
       }

       if (user.isAdmin && ! isAdmin) {
           utils.setErrorResponse("Usuario no autorizado.",
               464,
               res);
           return;
       }

        const response = await RecoveryRequests.destroy( {
            where: {
                userId: user.id
            } } ).catch(error => {
            return error.toString();
        } );

       const response2 = await RecoveryRequests.create( {
           userId: user.id
       } ).catch(error => {
           return error.toString();
       } );

       if (response2.dataValues === undefined) {
           Logger.error("Error al crear el link de recuperación.");

           utils.setErrorResponse("Error al crear el link de recuperación.",
               561,
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
               result: "Se envío un correo a la cuenta para reestablecer la contraseña."
           },
           201,
           res);
   }
}

module.exports = ForgotPassword;
