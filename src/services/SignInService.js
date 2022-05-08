const constants = require('../others/constants');
const utils = require("../others/utils");
const Logger = require("./Logger");
const { Op } = require("sequelize");
const {Users} = require("../data/Users");

class SignInService {
  defineEvents(app) {
    /**
    * @swagger
    * /signin:
    *   post:
    *    summary: Sign in
    *
    *    description: Allow sign in.
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
    *           description: "User exists."
    *
    *         "462":
    *           descritption: "User does not exist."
    *
    *         "463":
    *           description: "Not admin."
    *
    *         "464":
    *           description: "User blocked."
    */
    app.post( constants.SIGN_IN_URL,
              this.handleSignIn
                  .bind(this) );
  }

    async handleSignIn(req, res) {
        const { email,
            password,
            link } = req.body;

        const isAdmin = link === "web";

        const user = await Users.findOne({
            where: {
                [Op.and]:
                    [{email: email},
                        {password: password}]
            }
        });

        if (user === undefined || user === null
            || (! isAdmin && user.isAdmin)) {
            return utils.setErrorResponse("No se encontró ningun usuario con ese mail y/ o contraseña",
                462,
                res);
        }
        else if (isAdmin && ! user.isAdmin) {
            return utils.setErrorResponse("Usuario no autorizado.",
                463,
                res);
        } else if (user.isBlocked) {
            return utils.setErrorResponse("Usuario bloqueado.",
                464,
                res);
        }

        const responseBody = {
            email: user.email,
            status: "ok"
        }

        Logger.info("Ingreso con email y contraseña: " + user.email);

        utils.setBodyResponse(responseBody,
            200,
            res);
    }
}

module.exports = SignInService;
