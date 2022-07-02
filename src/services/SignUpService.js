const {auth} = require("../services/FirebaseService");
const constants = require('../others/constants');
const utils = require("../others/utils");
const NonActivatedUsers = require("../data/NonActivatedUsers");
const {Users} = require("../data/Users");
const Logger = require("./Logger");
const {areAnyUndefined, invalidFieldFormat} = require("../others/utils");
const {sendConfirmationEmail} = require('../services/MailService');
const {Op} = require("sequelize");
const WhatsAppService = require("../services/WhatsAppService");


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
     *         "200":
     *           description: "Mail to verify email sent."
     *
     *         "461":
     *           description: "Mail already registered."
     *
     *         "462":
     *           description: "Empty required field."
     *
     *         "464":
     *           description: "User already signed in as external."
     *
     *         "465":
     *           description: "Mail already sent."
     * 
     *         "416":
     *           description: "Invalid field format"
     *
     *         "561":
     *           description: "Could not save user temporarily."
     *
     *         "562":
     *           description: "Could not create account."
     *
     *         "563":
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
     *         "200":
     *           description: "User created."
     *
     *         "461":
     *           description: "Invalid confirmation link."
     *
     *         "561":
     *           description: "Error creating user."
     */
    app.get( constants.SIGN_UP_END_URL + '/:userId/:pin',
      this.createVerifiedUser
        .bind(this) );

  }
    async handleSignUp(req,
                       res) {
        Logger.request(constants.SIGN_UP_URL);

        const {
            email,
            password,
            phoneNumber,
            username,
            isArtist,
            isListener,
            isBand,
            link,
            isExternal,
            latitude,
            longitude
        } = req.body;

        const isAdmin = link === "web";
        let fields;

        if ( isAdmin ){
            fields=[email, password];
        }
        else{
            fields = [username, email, phoneNumber, password];
        }

        if (areAnyUndefined(fields)) {
            utils.setErrorResponse("Faltan completar campos requeridos", 400, res);
            return;
        }

        if (invalidFieldFormat(email, password)) {
            return utils.setErrorResponse('Hay campos con un formato incorrecto.', 400, res);
        }

        const id = utils.getId();

        const user = await Users.findOne({
                where: {email}
            })
            .catch(error => ({
                error: error.toString()
            }));

        if (user !== null) {
            if (user.error !== undefined) {
                Logger.error(user.error);

                return utils.setErrorResponse("Error al crear al usuario.",
                                                562,
                                                res);
            } else if (user.isExternal) {
                return utils.setErrorResponse("El usuario ya se ha loguedo de manera externa y " +
                                                "ya no puede registrarse en esta aplicación",
                                                464,
                                                res);
            } else {
                return utils.setErrorResponse("Ya hay un usuario con ese mail",
                                                461,
                                                res);
            }
        }

        const nonUser = await NonActivatedUsers.findOne({where: {email}});

        if (nonUser !== null) {
            utils.setErrorResponse("Ya hay un usuario con ese mail pendiente de confirmación",
                465,
                res);

            return;
        }

        const pin = Math.random().toString().slice(2, 9);

        await NonActivatedUsers.create({
            id,
            email,
            password,
            isAdmin,
            isExternal,
            pin,
            phoneNumber,
            username,
            isArtist,
            isListener,
            isBand,
            latitude,
            longitude,
        })
            .catch(error => {
            Logger.error("No se pudo crear el usuario temporal " + error.toString());

            utils.setErrorResponse("Error al intentar crear la cuenta.",
                562,
                res);
        });

        if (res.statusCode >= 400) {
            return;
        }

        try {
            let message;
            if (isAdmin) {
                await sendConfirmationEmail(email, pin,
                    `${constants.BACKOFFICE_HOST}${constants.SIGN_UP_END_URL}/${id}/${pin}`);
                message = "Correo enviado";
            } else {
                await WhatsAppService.sendVerificationCode(phoneNumber, pin);
                message = "Pin enviado";
            }

            Logger.info(message);

            const response = {result: message, id};
            utils.setBodyResponse(response, 200, res);
        } catch (error) {
            Logger.error(error.toString());

            await NonActivatedUsers.destroy({
                where: {id}
            });

            return utils.setErrorResponse("No se pudo enviar el mensaje.",
                                            563,
                                            res);
        }
    }

    async createVerifiedUser(req, res) {
        Logger.request(constants.SIGN_UP_END_URL + '/:userId/:pin');

        const userId = req.params.userId;

        const pin = req.params.pin;

        const tempUser = await NonActivatedUsers.findOne({
            where: {[Op.and]: [{id: userId}, {pin}]}
        });

        if (tempUser === null) {
            Logger.error("461: PIN de confirmación inválido");

            return utils.setErrorResponse("PIN de confirmación inválido",
                461,
                res);
        }

        const requestBody = {
            redirectTo: constants.PAYMENT_HOST + constants.WALLET_URL,
        }
        const gatewayResponse = await utils.postToGateway(requestBody);
        if (gatewayResponse.error !== undefined) {
            Logger.error("500: " + gatewayResponse.error.toString());

            return utils.setErrorResponse(gatewayResponse.error,
                500,
                res);
        }

        const response = await auth.createUser({
            email: tempUser.email,
            emailVerified: true,
            password: tempUser.password,
            disabled: false
        })
            .catch(error => ({error: error.toString()}));

        if (response.error !== undefined) {
            Logger.error("561: " + response.error.toString());
            
            return utils.setErrorResponse(response.error,
                561,
                res);
        }

        const responseBody = {
            status: "ok",
            id: response.uid
        }

        await Users.create({
            id: response.uid,
            email: tempUser.email,
            password: tempUser.password,
            isAdmin: tempUser.isAdmin,
            isBlocked: false,
            isExternal: tempUser.isExternal,
            phoneNumber: tempUser.phoneNumber,
            username: tempUser.username,
            isArtist: tempUser.isArtist,
            isListener: tempUser.isListener,
            isBand: tempUser.isBand,
            latitude: tempUser.latitude,
            longitude: tempUser.longitude,
            walletId: gatewayResponse.id,
        });

        await NonActivatedUsers.destroy({
            where: {
                id: userId
            }
        });

        Logger.info("Usuario creado con email y contraseña: " + response.uid);

        res.status(200)
            .json(responseBody);
    }
}


module.exports = SignUpService;
