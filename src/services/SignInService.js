const {auth} = require("../services/FirebaseService");
const constants = require('../others/constants');
const utils = require("../others/utils");
const Logger = require("./Logger");
const { Op } = require("sequelize");
const Users = require("../data/Users");

async function signInWithBiometric(req, res){
    const { email, password, idToken, link } = req.body;

    const isAdmin = link === "web";

    let accessToken = undefined;

    const user = await Users.findOne({
        where: {
            [Op.and]:
                [{email: email},
                 {password: password}]
        }
    });

    if (user === null) {
        const response = await auth.createUser( {
            email: email,
            emailVerified: true,
            password: password,
            disabled: false
        } )
            .catch(error => {
                return { error: error.toString() }
            } );

        if (response.error !== undefined) {
            Logger.error(error.toString());

            utils.setErrorResponse(error,
                561,
                res);

            return;
        }

       accessToken = response.user.accessToken;

       await Users.create( {
           id: response.user.uid,
           email: email,
           password: hashedPassword,
           isAdmin: isAdmin,
           isBlocked: false,
           isExternal: true
       } )
    }

    if (user === undefined) {
        await Users.create({
            id: response.user_id,
            email: email,
            password: password,
            isAdmin: false,
            isBlocked: false,
            isExternal: true
        });
    
    }

    if (accessToken !== undefined)
        utils.setBodyResponse({token: accessToken},
            200,
            res);
        return;

    const responseBody = {
        status: "ok"
    }

    utils.setBodyResponse(responseBody,
            200,
            res);
}

async function sigInWithOutGoogle(req, res) {
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
    }

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

    if (user.isAdmin && ! isAdmin) {
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

async function sigInWithGoogle(req, res) {
    const { token, email} = req.body;

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
        await Users.create({
            id: response.user_id,
            email: email,
            password: utils.getHashOf( utils.getHashOf(email)),
            isAdmin: false,
            isBlocked: false,
            isExternal: true
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
    *           descritption: "User not exists."
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

        if ( req.body
                .signin === 'google' ){
            await sigInWithGoogle(req, res);
        }
        else if ( req.body
                     .signin === 'biometric' ){
            await signInWithBiometric(req, res);
        }
        else{
            await sigInWithOutGoogle(req, res);
        }
   }        

}

module.exports = SignInService;
