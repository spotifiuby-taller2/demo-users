const {auth} = require("../services/FirebaseService");
const firebaseAuth = require("firebase/auth");
const constants = require('../others/constants');
const utils = require("../others/utils");
const Users = require("../data/Users");
const Logger = require("./Logger");
const { areAnyUndefined } = require("../others/utils");
const { Sequelize, Op } = require("sequelize");

class SignUpService {
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
    *         "201":
    *           description: "User exists."
    * 
    *         "401":
    *           descritption: "Empty fields"
    * 
    *         "402":
    *           descritption: "User not exists"
    *
    */
    app.post( constants.SIGN_IN_URL,
              this.handleSignIn
                  .bind(this) );

  }

  async handleSignIn(req,
                       res) {
        Logger.request(constants.SIGN_IN_URL);

        const { email, password, link } = req.body;

        const isAdmin = link === "web";

        
        if ( areAnyUndefined([email, password]) ) {
            utils.setErrorResponse("Por favor complete todos los campos.",
                                    401,
                                    res);

            return;
        }

        const user = await Users.findOne({
            where: {
                [Op.and]:
                    [{email: email}, {password: utils.getBcryptOf(password)}]
            }
        });

        if (user === null) {
            utils.setErrorResponse("No se encontro ningun usuario con ese mail y/ o contraseña",
                402,
                res);
            return;
        }

        utils.setBodyResponse(`Usuario ${email} encontrado, puede entrar en la aplicación`, 201, res);

    }

}

module.exports = SignUpService;
