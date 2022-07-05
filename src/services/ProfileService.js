const {setBodyResponse, setErrorResponse} = require("../others/utils");
const constants = require("../others/constants");
const {Users, ArtistFav} = require("../data/Users");
const Logger = require("./Logger");
const utils = require("../others/utils");
const {Op} = require("sequelize");
const {ArtistsBands} = require("../data/ArtistsBands");
const fetch = require("node-fetch");


async function paySuscription(walletId) {
    const requestToPayment = {
        senderId: walletId,
        amountInEthers: constants.PREMIUN_COST,
    }

    return await fetch(constants.PAYMENT_HOST + constants.DEPOSIT_URL, {
        method: "POST",
        headers: constants.JSON_HEADER,
        body: JSON.stringify(requestToPayment)
    } )
        .then( res => res.json() )
        .catch(err => {
            return {error: err.toString}
        } );
}

class ProfileService {
    defineEvents(app) {
        /**
         * @swagger
         * /users/profile:
         *   get:
         *    summary: User profile.
         *
         *    description: Return user profile.
         *
         *    parameters:
         *         - name: "id"
         *           in: body
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "Return profile."
         *
         *         "461":
         *           description: "User does not exist."
         */
        app.get(constants.PROFILE_URL,
            this.getProfile.bind(this));

        /**
         * @swagger
         * /users/profile/musicalpref:
         *   patch:
         *    summary: Users list.
         *
         *    description: Return list of users.
         *
         *    parameters:
         *         - name: "id"
         *           in: body
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "Musical preferences updated."
         *
         *         "461":
         *           description: "User does not exist."
         *
         *         "500":
         *           description: "Database error."
         */
        app.patch(constants.MUSICAL_PREF_URL,
            this.updateMusicalPreferences
                .bind(this));

        /**
         * @swagger
         * /users/profile/photo:
         *   patch:
         *    summary: set profile photo url.
         *
         *    description: update profile photo url.
         *
         *    parameters:
         *         - name: "id"
         *           in: body
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "profile photo updated."
         *
         *         "461":
         *           description: "User does not exist."
         */
        app.patch(constants.PROFILE_PHOTO_URL,
            this.updatePhotoUrl
                .bind(this));


        /**
         * @swagger
         * /users/profile/basicinfo:
         *   get:
         *    summary: get user username, and type.
         *
         *    description: get user username, and type.
         *
         *    parameters:
         *         - name: "id"
         *           in: query
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "return user username and type."
         *
         *         "461":
         *           description: "User does not exist."
         */
        app.get(constants.PROFILE_USER_BASIC_INFO_URL,
            this.getUserBasicInfo
                .bind(this));


        /**
         * @swagger
         * /users/editprofile:
         *   patch:
         *    summary: edit profile.
         *
         *    description: edit user profile and return message if everthing is ok.
         *
         *    parameters:
         *         - name: "id"
         *           in: body
         *           type: "string"
         *           required: true
         *
         *         - name: "username"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "phoneNumber"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "metal"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "pop"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "punk"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "rap"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "reggeaton"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "classic"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "electronic"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "blues"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "salsa"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "rock"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "indie"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "jazz"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *         - name: "others"
         *           in: body
         *           type: "string"
         *           required: false
         *
         *    responses:
         *         "200":
         *           description: "return message profile edit was successful"
         *
         *         "561":
         *           description: "Error editing profile"
         *
         *         "562":
         *           description: "Error editing user email"
         */
        app.patch(constants.EDIT_PROFILE_URL,
            this.editProfile
                .bind(this));

        /**
         * @swagger
         * /users/profile/pushNotificationToken:
         *   patch:
         *    summary: set push notification token.
         *
         *    description: Return list of users.
         *
         *    parameters:
         *         - name: "id"
         *           in: query
         *           type: "string"
         *           required: true
         *
         *         - name: "token"
         *           in: body
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "201":
         *           description: "Push notification token updated."
         *
         *         "461":
         *           description: "User does not exist."
         *
         *         "462":
         *           description: "Update push notification token failed"
         */
        app.patch(constants.PUSH_NOTIFICATION_TOKEN_URL,
            this.setPushNotificationToken.bind(this));

        app.patch(constants.PROFILE_VERIFICATION_VIDEO_URL,
            this.updateVerificationVideoUrl.bind(this));

        app.get(constants.USER_WITH_WALLET_URL,
            this.getUserWithWallet.bind(this))

        // this.paySuscription.bind(this);
        this.checkSuscriptions.bind(this);
    }

    async getProfile(req, res) {
        Logger.info("Request a /users/profile");

        const userId = req.query.userId;
        let nMembers = 0;

        let whereCondition;

        if (req.query.adminRequest === undefined) {
            whereCondition = {
                [Op.and]: [
                    {id: userId},
                    {isBlocked: false}]
            };
        } else {
            whereCondition = {
                [Op.and]: [
                    {id: userId}]
            };
        }

        const user = await Users.findOne({
            where: whereCondition
        }).catch(error => ({
            error: error.toString()
        }));

        if (user === null) {
            return utils.setErrorResponse("El usuario no existe.",
                400,
                res);
        }

        if (user.isBand) {
            const members = await ArtistsBands.findAll({
                where: {
                    idBand: user.id,
                }
            });

            nMembers = members.length;
        }

        const profileResponse = {
            'id': user.id,
            'email': user.email,
            'phoneNumber': user.phoneNumber,
            'username': user.username,
            'isArtist': user.isArtist,
            'isListener': user.isListener,
            'isBand': user.isBand,
            'isAdmin': user.isAdmin,
            'metal': user.metal,
            'rap': user.rap,
            'pop': user.pop,
            'classic': user.classic,
            'electronic': user.electronic,
            'jazz': user.jazz,
            'reggeaton': user.reggeaton,
            'indie': user.indie,
            'punk': user.punk,
            'salsa': user.salsa,
            'blues': user.blues,
            'rock': user.rock,
            'others': user.other,
            'photoUrl': user.photoUrl,
            'pushNotificationToken': user.pushNotificationToken,
            'isVerified': user.isVerified,
            'verificationVideoUrl': user.verificationVideoUrl,
            'subscription': user.subscription,
            'nMembers': nMembers,
        };


        if (user.isArtist) {

            const followers = await ArtistFav.findAll(
                {
                    where: {
                        idArtist: user.id,
                    }
                }
            ).catch(err => ({error: err.toString()}))

            if (followers.error !== undefined) {
                return utils.setErrorResponse(followers.error, 581, res);
            }

            profileResponse['nFollowers'] = followers.length;

        }

        return utils.setBodyResponse(profileResponse, 200, res);
    }

    async updateMusicalPreferences(req, res) {

        Logger.info("Request a /users/profile/musicalpref");

        const userId = req.query.userId;

        const {musicalPref} = req.body;

        const user = await Users.findOne({
            where: {
                [Op.and]: [{id: userId},
                    {isBlocked: false}]
            }
        }).catch(error => ({
            error: error.toString()
        }));

        if (user === null) {
            return utils.setErrorResponse("El usuario no existe.",
                400,
                res);
        }

        if (user.error !== undefined) {
            return utils.setErrorResponse("Error al consultar la base de datos.",
                500,
                res);
        }

        const response = await Users.update(
            {
                metal: musicalPref.metal,
                rock: musicalPref.rock,
                jazz: musicalPref.jazz,
                pop: musicalPref.pop,
                punk: musicalPref.punk,
                reggeaton: musicalPref.reggeaton,
                salsa: musicalPref.salsa,
                indie: musicalPref.indie,
                rap: musicalPref.rap,
                classic: musicalPref.classic,
                blues: musicalPref.blues,
                other: musicalPref.other,
                electronic: musicalPref.electronic,
            },
            {
                where:
                    {id: userId}
            }
        ).catch(error => ({error: error.toString()}));

        if (response.error !== undefined) {
            Logger.error(response.error.toString());

            utils.setErrorResponse(response.error,
                500,
                res);

            return;
        }

        return setBodyResponse({status: 'Intereses musicales actualizados'}, 200, res);
    }

    async updatePhotoUrl(req, res) {

        Logger.info("Request a /users/profile/photo");

        const userId = req.query.userId;
        const photoUrl = req.body.photoURL;


        const user = await Users.findOne({
            where: {
                [Op.and]: [{id: userId},
                    {isBlocked: false}]
            }
        }).catch(error => ({
            error: error.toString()
        }));

        if (user === null || user.error !== undefined) {
            return utils.setErrorResponse("El usuario no existe.",
                461,
                res);
        }

        const response = await Users.update(
            {photoUrl},
            {
                where:
                    {id: userId}
            }
        ).catch(error => ({error: error.toString()}));

        if (response.error !== undefined) {
            Logger.error(response.error.toString());

            utils.setErrorResponse(response.error,
                500,
                res);

            return;
        }

        return utils.setBodyResponse({status: 'Foto de perfil actualizada'}, 200, res);
    }

    async getUserBasicInfo(req, res) {

        Logger.info("Request a /users/profile/basicinfo");

        const userId = req.query.userId;

        const user = await Users.findOne({
            where: {
                [Op.and]: [{id: userId},
                    {isBlocked: false}]
            }
        }).catch(error => ({
            error: error.toString()
        }));

        if (user === null) {
            Logger.error(`No existe el usuario`);

            return utils.setErrorResponse(`No existe el usuario`,
                400,
                res);
        }

        Logger.info(`Usuario encontrado.`);

        utils.setBodyResponse({
                type: user.isListener ? constants.LISTENER : constants.ARTIST,
                username: user.username,
                subscription: user.subscription
            },
            201,
            res);

    }

    async postToPayments(userId) {
        const user = await Users.findOne(
            {
                where: {[Op.and]: [{id: userId}, {isBlocked: false,}]}
            }).catch(err => {
            return {error: err.toString()}
        });

        if (user === null) return {error: 'user not exist'}
        if (user?.error !== undefined) return undefined;

        if ( utils.notMonthIntervalYet(user.lastPaymentDate) ) {
            return 0;
        }

       return paySuscription(user.walletId);
    }

    async editProfile(req, res) {
        Logger.info("Request a /users/editprofile");

        const userId = req.query.userId;
        const body = req.body;
        const isListener = req.body.isListener;
        let paymentsRes = null;
        let message = {status: 'Perfil del usuario actualizado'};

        delete body.apiKey;
        delete body.verbRedirect;
        delete body.redirectTo;
        delete body.isListener;

        if (isListener && body.subscription === 'premium') {
            paymentsRes = await this.postToPayments(userId);
            if (paymentsRes?.error !== undefined || paymentsRes === undefined) {
                delete body.subscription;
                const notEnoughtMoney = 'No se pudo cambiar su suscription por saldo insuficiente.';
                const anotherError = 'Error en el servicio de pagos, no se pudo efectuar el cambio de subcripción';
                (paymentsRes?.error === constants.NOT_ENOUGHT_MONEY_PAYMENT_ERROR) ?
                    message = notEnoughtMoney
                    : message = anotherError;

                return utils.setErrorResponse(message,
                    461,
                    res);

            } else if (paymentsRes !== 0) {
                const today = new Date();
                body.lastPaymentDate = today;
            }
        }

        const response = await Users.update(
            body,
            {
                where: {
                    id: userId,
                    isBlocked: false
                }
            }
        )
            .catch(error => ({error: error.toString()}));

        if (response.error !== undefined || response === 0) {
            Logger.error("No se pudo editar el perfil del usuario");

            return utils.setErrorResponse("No se pudo editar el perfil del usuario", 461, res);
        }

        utils.setBodyResponse(message,
                              201,
                              res);
    }

    async setPushNotificationToken(req, res) {

        Logger.info("Request a /users/profile/pushnotificationtoken");

        const userId = req.query.userId;
        const {token} = req.body;

        const user = await Users.findOne({
            where: {
                [Op.and]: [{id: userId},
                    {isBlocked: false}]
            }
        }).catch(error => ({
            error: error.toString()
        }));

        if (user === null || user.error !== undefined) {
            return utils.setErrorResponse("El usuario no existe.",
                400, res);
        }

        const updatedUser = await Users.update(
            {
                pushNotificationToken: token
            },
            {
                where: {
                    [Op.and]: [{id: userId},
                        {isBlocked: false}]
                }
            }
        ).catch(error => ({
            error: error.toString()
        }));

        if (updatedUser === null || updatedUser.error !== undefined) {
            return utils.setErrorResponse(`No se pudo actualizar el push notification token del usuario ${userId}`,
                500,
                res);
        }

        return utils.setBodyResponse({status: 'Push notification token actualizado'},
            201,
            res);

    }

    async updateVerificationVideoUrl(req, res) {

        Logger.info("Request a /users/profile/verification/video");
        const {userId, verificationVideoUrl} = req.body;

        const user = await Users.findOne({
            where: {
                [Op.and]: [{id: userId},
                    {isBlocked: false}]
            }
        }).catch(error => ({
            error: error.toString()
        }));

        if (user === null || user.error !== undefined) {
            return utils.setErrorResponse("El usuario no existe.", 400, res);
        }

        const response = await Users.update(
            {verificationVideoUrl},
            {
                where:
                    {id: userId}
            }
        ).catch(error => ({error: error.toString()}));

        if (response.error !== undefined) {
            Logger.error(response.error.toString());
            utils.setErrorResponse(response.error, 500, res);
            return;
        }
        return utils.setBodyResponse({status: 'Video de verificacion actualizado'}, 200, res);
    }

    async getUserWithWallet(req,
                            res) {
        Logger.info("Request a /userwithwallet");

        const user = await Users.findOne({
                where: {
                    walletId: req.query
                                 .walletId
                }
            }
        ).catch(error => {
            return {
                error: error.toString()
            }
        } );

        if (user === null || user?.error !== undefined) {
            Logger.error(user?.error.toString());

            return utils.setErrorResponse("Usuario no encontrado",
                500,
                res);
        }

        const response = {
            userId: user.id
        };

        return utils.setBodyResponse(response,
            200,
            res);
    }

    async checkSuscriptions() {
        Logger.info("** Chequeando suscripciones **");

        const premiumUsers = await Users.findAll( {
                                where: {
                                    subscription: "premium"
                                }
                            } ).catch(err => {
                                return {
                                    error: err.toString()
                                }

                            } );

        if (premiumUsers === null || premiumUsers?.error !== undefined) {
            Logger.error("Error al chequear suscripciones.");

            Logger.error( err.toString() );

            return;
        }

        const filteredUsers = premiumUsers.filter(user => ! utils.notMonthIntervalYet(user.lastPaymentDate) )
                                          .map(user => user.get({plain: true}));

        await Promise.all(filteredUsers.map( async usr => {
                if ( (await paySuscription(usr.walletId) ).error !== undefined ) {
                        await Users.update( {
                             subscription: "free",
                         }, {
                            where: {
                                id: usr.id
                            }
                        } ).then(res => {
                           Logger.info("Suscripción pasada a free por fondos insuficientes para "  + usr.id);
                        } ).catch(error => {
                            Logger.error("No se pudo actualizar la suscripción de: " + usr.id);
                        } );
                } else {
                    await Users.update( {
                        lastPaymentDate: Date.now()
                    }, {
                        where: {
                            id: usr.id
                        }
                    } ).then(res => {
                        Logger.info("Suscripción premium renovada para "  + usr.id);
                    } ).catch(error => {
                        Logger.error("No se pudo actualizar la suscripción de: " + usr.id);
                    } );
                }
            } )
        );
    }

}

module.exports = ProfileService
