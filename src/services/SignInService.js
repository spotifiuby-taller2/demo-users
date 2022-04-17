const {auth} = require("../services/FirebaseService");
const constants = require('../others/constants');
const utils = require("../others/utils");
const Logger = require("./Logger");
const { Op } = require("sequelize");
const Users = require("../data/Users");

async function signInWithBiometric(req, res) {
    const {  idToken } = req.body;

    if (idToken === undefined) {
        await createBiometricSignInUser(req.body, res);
        return;
    }

    await signInWithOutGoogle(req, res);
}

async function createBiometricSignInUser(body, res){
    const response = await auth.createUser( {
        email: body.email,
        emailVerified: true,
        password: body.password,
        disabled: false
    } ) .then(async(res) => {

        const requestBody = {
            redirectTo: constants.PAYMENT_HOST + constants.WALLET_URL,
        }
        const gatewayResponse = await utils.postToGateway(requestBody);
        if (gatewayResponse.error !== undefined) {
            Logger.error(gatewayResponse.error.toString());
            utils.setErrorResponse(gatewayResponse.error,
                500,
                res);
            return;
        }

       // Solves promises
        Users.create({
            id: res.uid,
            email: body.email,
            password: body.password,
            isAdmin: false,
            isBlocked: false,
            isExternal: true,
            isListener: body.isListener,
            isArtist: body.isArtist,
            latitude: body.latitude,
            longitude: body.longitude,
            walletId: gatewayResponse.id
        })
    } )
    .catch(error => {
        return { error: error.toString() }
    } );

    if (response !== undefined && response.error !== undefined) {
        Logger.error(response.error.toString());

        return utils.setErrorResponse(response.error,
            511,
            res);
    }

    const responseBody = {
        status: "ok"
    }

    utils.setBodyResponse(responseBody,
        201,
        res);
}

async function signInWithOutGoogle(req, res) {
    const { email,
            password,
            idToken,
            link } = req.body;

    const isAdmin = link === "web";

    const response = await auth.verifyIdToken(idToken);

    if (response.user_id === undefined) {
        utils.setErrorResponse("No se pudo encontrar ningun usuario con ese mail y/ o contraseña",
            462,
            res);

        return;
    };

    const user = await Users.findOne({
        where: {
            [Op.and]:
                [{email: email},
                 {password: password},
                 {id: response.user_id}]
        }
    });

    if (user === undefined || user === null) {
        utils.setErrorResponse("No se encontró ningun usuario con ese mail y/ o contraseña",
            462,
            res);

        return;
    }
    else if (isAdmin && ! user.isAdmin) {
        utils.setErrorResponse("Usuario no autorizado.",
            463,
            res);
        return;
    }

    const responseBody = {
        status: "ok"
    }

    utils.setBodyResponse(responseBody,
            200,
            res);
}

async function signInWithGoogle(req, res) {
    const { token, email, name, surname, phoneNumber, isArtist, isListener, latitude, longitude} = req.body;

    const response = await auth.verifyIdToken(token);

    if (response.user_id === undefined) {
        utils.setErrorResponse("No se encontro ningun usuario con esa cuenta",
            462,
            res);

        return;
    }

    const user = await Users.findOne({
        where: {
            email: email
        }
    });

    if (user === null) {

        const requestBody = {
            redirectTo: constants.PAYMENT_HOST + constants.WALLET_URL,
        }
        const gatewayResponse = await utils.postToGateway(requestBody);
        if (gatewayResponse.error !== undefined) {
            Logger.error(gatewayResponse.error.toString());
            utils.setErrorResponse(gatewayResponse.error,
                500,
                res);
            return;
        }

        await Users.create({
            id: response.user_id,
            email: email,
            password: utils.getHashOf( utils.getHashOf(email)),
            isAdmin: false,
            isBlocked: false,
            isExternal: true,
            name: name,
            surname: surname,
            isArtist: isArtist,
            isListener: isListener,
            latitude: latitude,
            longitude: longitude,
            walletId: gatewayResponse.id
        });
    }

    utils.setBodyResponse(
        {status: "ok"},
        200,
        res);
}

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
    */
    app.post( constants.SIGN_IN_URL,
              this.handleSignIn
                  .bind(this) );
  }

  async handleSignIn(req, res)
   {
        Logger.request(constants.SIGN_IN_URL);

        if ( req.body.signin === 'google' ){
            await signInWithGoogle(req, res);
        }
        else if ( req.body
                     .signin === 'biometric' ){
            await signInWithBiometric(req, res);
        }
        else{
            await signInWithOutGoogle(req, res);
        }
   }        

}

module.exports = SignInService;
