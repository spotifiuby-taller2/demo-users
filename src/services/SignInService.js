const {auth} = require("../services/FirebaseService");
const {getAuth,signInWithCredential, GoogleAuthProvider} = require("firebase/auth");
const firebaseAuth = require("firebase/auth");
const constants = require('../others/constants');
const utils = require("../others/utils");
const Logger = require("./Logger");
const { Op } = require("sequelize");
const Users = require("../data/Users");

async function signInWithBiometric(req, res){
    const { email, password, link } = req.body;

    const isAdmin = link === "web";

    let accessToken = undefined;

    const hashedPassword = utils.getBcryptOf(password);

    const user = await Users.findOne({
        where: {
            [Op.and]:
                [{email: email},
                 {password: hashedPassword}]
        }
    });

    if (user === null) {

        firebaseAuth.createUserWithEmailAndPassword(auth,
            email,
            hashedPassword)
        .then((response) => {

            accessToken = response.user.accessToken;

            Users.create( {
                id: response.user.uid,
                email: email,
                password: hashedPassword,
                isAdmin: isAdmin,
                isBlocked: false,
                isExternal: true
            } )
            .catch(error => {

                utils.setErrorResponse("Error al intentar crear la cuenta.",
                    502,
                    res);
            });

        })
        .catch(error =>{
            console.log(error);
        });
    }

    else if (user.isAdmin && ! isAdmin) {
        utils.setErrorResponse("Usuario no autorizado.",
            403,
            res);
        return;
    }

    if (accessToken !== undefined)
        utils.setBodyResponse({token: accessToken},
            201,
            res);
        return;

    const response = await firebaseAuth.signInWithEmailAndPassword(auth,
        email,
        hashedPassword)
        .catch(error => {
                utils.setErrorResponse("Error al intentar inicializar la cuenta.",
                    502,
                    res);
            }
        );

    if (res.statusCode >= 400) {
        return;
    }


    utils.setBodyResponse({token: response.user.accessToken},
            201,
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
        utils.setErrorResponse("No se encontro ningun usuario con ese mail y/ o contraseña",
            412,
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

    if (user === undefined) {
        utils.setErrorResponse("No se encontro ningun usuario con ese mail y/ o contraseña",
            412,
            res);

        return;
    }

    if (user.isAdmin && ! isAdmin) {
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

async function sigInWithGoogle(req, res) {
    const { token } = req.body;

    const response = await auth.verifyIdToken(token.idToken);

    if (response.user_id === undefined) {
        utils.setErrorResponse("No se encontro ningun usuario con esa cuenta",
            412,
            res);

        return;
    }

    const user = await Users.findOne({
        where: {
            email: token.user.email
        }
    });

    if (user === null) {
        await Users.create({
            id: uid,
            email: token.user
                .email,
            password: utils.getHashOf(token.user
                .email),
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
            await sigInWithGoogle(req, res);
        }
        else if ( req.body.signin === 'biometric' ){
            await signInWithBiometric(req, res);
        }
        else{
            await sigInWithOutGoogle(req, res);
        }
   }        

}

module.exports = SignInService;
