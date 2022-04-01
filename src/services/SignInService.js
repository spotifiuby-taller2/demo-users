const {auth} = require("../services/FirebaseService");
const constants = require('../others/constants');
const utils = require("../others/utils");
const Logger = require("./Logger");
const { Op } = require("sequelize");
const Users = require("../data/Users");

async function signInWithBiometric(req, res){
    const { email, password, idToken } = req.body;

    if (idToken === undefined){
        createBiometricSignInUser(email, password, res);
        return;
    }
    
    signInWithOutGoogle(req, res);
    };

async function createBiometricSignInUser(email, password, res){

    
    response = await auth.createUser( {
        email: email,
        emailVerified: true,
        password: password,
        disabled: false
    } ) .then(res => {

        Users.create( {
            id: res.uid,
            email: email,
            password: password,
            isAdmin: false,
            isBlocked: false,
            isExternal: true
        } )
    })
        .catch(error => {
            return { error: error.toString() }
        } );

    if (response !== undefined && response.error !== undefined) {
        Logger.error(response.error.toString());

        utils.setErrorResponse(response.error,
            511,
            res);

        return;
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
        utils.setErrorResponse("No se encontro ningun usuario con ese mail y/ o contraseña",
            412,
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

    if (user === undefined) {
        utils.setErrorResponse("No se encontro ningun usuario con ese mail y/ o contraseña",
            412,
            res);

        return;
    }
    else if (user.isAdmin && ! isAdmin) {
        utils.setErrorResponse("Usuario no autorizado.",
            413,
            res);
        return;
    }

    const responseBody = {
        status: "ok"
    }

    utils.setBodyResponse(responseBody,
            201,
            res);
}

async function signInWithGoogle(req, res) {
    const { token, email} = req.body;

    const response = await auth.verifyIdToken(token);

    if (response.user_id === undefined) {
        utils.setErrorResponse("No se encontro ningun usuario con esa cuenta",
            412,
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
        201, 
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
    *         "201":
    *           description: "User exists."

    *         "412":
    *           descritption: "User not exists."
    *
    *         "413":
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
        else if ( req.body.signin === 'biometric' ){
            await signInWithBiometric(req, res);
        }
        else{
            await signInWithOutGoogle(req, res);
        }
   }        

}

module.exports = SignInService;
