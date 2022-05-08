const constants = require('../others/constants');
const utils = require("../others/utils");
const {Users} = require("../data/Users");
const {NonActivatedUsers} = require("../data/NonActivatedUsers");
const Logger = require("./Logger");
const {areAnyUndefined, invalidFieldFormat} = require("../others/utils");
const {sendConfirmationEmail} = require('../services/MailService');
const {Op} = require("sequelize");

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
            name,
            isArtist,
            isListener,
            surname,
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
            fields = [name, surname, email, phoneNumber, password];
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
            .catch(error => {
                return {
                    error: error.toString()
                };
            });

        if (user !== null) {
            if (user.error !== undefined) {
                Logger.error(user.error);

                return utils.setErrorResponse("Error al crear al usuario.",
                                                562,
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

        const pin = utils.getId();

        await NonActivatedUsers.create( {
            email,
            password,
            isAdmin,
            isExternal,
            pin,
            phoneNumber,
            name,
            surname
        }).catch(error => {
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

                await sendConfirmationEmail(email, pin,
                    `${constants.FRONT_HOST}${constants.SIGN_UP_END_URL}/${pin}/${pin}`);
                message = "Correo enviado";

            Logger.info(message);

            let response = {result: message, pin:  pin};

            utils.setBodyResponse(response, 200, res);
        } catch (error) {
            Logger.error(error.toString());

            await NonActivatedUsers.destroy({
                where: {
                    pin: pin
                }
            });

            return utils.setErrorResponse("No se pudo enviar el mensaje.",
                                            563,
                                            res);
        }
    }

    async createVerifiedUser(req, res) {
        Logger.request(constants.SIGN_UP_END_URL + '/:userId/:pin');

        const pin = req.params
                       .pin;

        const tempUser = await NonActivatedUsers.findOne({
            where: { [Op.and]: [
                {pin: pin}
            ] }
        } ).catch(error => {
                return {
                    error: error.toString()
                };
            });

        if (tempUser === null || tempUser.error !== undefined) {
            return utils.setErrorResponse("No se pudo consultar la base de datos.",
                563,
                res);
        }

        const responseBody = {
            status: "ok",
        }

        await Users.create({
            email: tempUser.email,
            password: tempUser.password,
            isAdmin: tempUser.isAdmin,
            phoneNumber: tempUser.phoneNumber,
            name: tempUser.name,
            surname: tempUser.surname,
        });

        await NonActivatedUsers.destroy({
            where: {
                pin: pin
            }
        });

        Logger.info("Usuario creado con email y contraseña");

        res.status(200)
            .json(responseBody);
    }
}


module.exports = SignUpService;
