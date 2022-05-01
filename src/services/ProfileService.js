const {setBodyResponse, setErrorResponse} = require("../others/utils");
const constants = require("../others/constants");
const {Users} = require("../data/Users");
const Logger = require("./Logger");
const utils = require("../others/utils");
const {Op} = require("sequelize");
const {auth} = require("../services/FirebaseService");

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
        app.get( constants.PROFILE_URL,
            this.getProfile
                .bind(this) );

        /**
         * @swagger
         * /users/profile/musicalpref:
         *   get:
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
         app.patch( constants.MUSICAL_PREF_URL,
            this.updateMusicalPreferences
                .bind(this) );

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
         *           description: "Musical preferences updated."
         *
         *         "461":
         *           description: "User does not exist."
         */
        app.patch( constants.PROFILE_PHOTO_URL,
            this.updatePhotoUrl
                .bind(this) );

        
        /**
         * @swagger
         * /users/profile/type:
         *   get:
         *    summary: get user type.
         *
         *    description: get user type.
         *
         *    parameters:
         *         - name: "id"
         *           in: query
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "return user type."
         *
         *         "461":
         *           description: "User does not exist."
         */

         app.get( constants.PROFILE_USER_TYPE_URL,
            this.getUserType
                .bind(this) );


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
         *         - name: "name"
         *           in: body
         *           type: "string"
         *           required: false
         * 
         *         - name: "surname"
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

         app.patch( constants.EDIT_PROFILE_URL,
            this.editProfile
                .bind(this) );
            }

    async getProfile(req,
                     res) {
        Logger.info("Request a /users/profile");

        const userId = req.query
                          .userId;

        const user = await Users.findOne({
            where: {
                [Op.and]: [{id: userId},
                           {isBlocked: false}]
            }
        }).catch(error => {
            return {
                error: error.toString()
            }
        } );

        if (user === null) {
            return setErrorResponse("El usuario no existe.",
                                    461,
                                    res);
        }

        const profileResponse = {
                'id': user.id,
                'email': user.email,
                'phoneNumber': user.phoneNumber,
                'name':  user.name,
                'surname':  user.surname,
                'isArtist':  user.isArtist,
                'isListener':  user.isListener,
                'isAdmin':  user.isAdmin,
                'metal': user.metal,
                'rap':  user.rap,
                'pop':  user.pop,
                'classic':  user.classic,
                'electronic':  user.electronic,
                'jazz':  user.jazz,
                'reggeaton':  user.reggeaton,
                'indie':  user.indie,
                'punk':  user.punk,
                'salsa':  user.salsa,
                'blues':  user.blues,
                'rock':  user.rock,
                'other':  user.other,
                'photoUrl': user.photoUrl
        };

        return setBodyResponse(profileResponse,
               200,
               res);
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
        }).catch(error => {
            return {
                error: error.toString()
            }
        });

        if (user === null) {
          return setErrorResponse("El usuario no existe.",
                                461,
                                res);
        }

        if (user.error !== undefined) {
            return setErrorResponse("Error al consultar la base de datos.",
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
            },
                {
                    where: 
                        {id: userId}
                }
            ).catch(error => ({ error: error.toString() }) );

        if (response.error !== undefined) {
            Logger.error(response.error.toString());

            utils.setErrorResponse(response.error,
                500,
                res);

            return;
            }
        

        return setBodyResponse({status: 'Intereses musicales actualizados'},
                200,
                res);
    }


    async updatePhotoUrl(req, res) {

        Logger.info("Request a /users/profile/photo");

        const userId = req.query.userId;
        const photoUrl = req.query.photoUrl;


        const user = await Users.findOne({
            where: {
                [Op.and]: [{id: userId},
                            {isBlocked: false}]
            }
        }).catch(error => {
            return {
                error: error.toString()
            }
        });

        if (user === null || user.error !== undefined) {
            return setErrorResponse("El usuario no existe.",
                                461,
                                res);
        }

        const response = await Users.update(
            {
                photoUrl: photoUrl
            },
                {
                    where: 
                        {id: userId}
                }
            ).catch(error => ({ error: error.toString() }) );
        
        if (response.error !== undefined) {
            Logger.error(response.error.toString());
          
            utils.setErrorResponse(response.error,
                561,
                res);
          
            return;
            }
        

        return setBodyResponse({status: 'Foto de perfil actualizada'},
                200,
                res);
    }


    async getUserType(req, res){
        
        Logger.info("Request a /users/profile/type");

        const userId = req.query.userId;

        const user = await Users.findOne({
            where: {
                [Op.and]: [{id: userId},
                            {isBlocked: false}]
            }
        }).catch(error => {
            return {
                error: error.toString()
            }
        });

        if ( user === null ){
            Logger.error(`No existe el usuario`);
        
            return utils.setErrorResponse(`No existe el usuario`,
                461,
                res);
        }

        Logger.info(`Usuario encontrado.`);

        utils.setBodyResponse({status: user.isListener? constants.LISTENER: constants.ARTIST},
            201,
            res);

    }

    async editProfile(req, res){

        Logger.info("Request a /users/editprofile");

        const userId = req.query.userId;
        const body = req.body;

        delete body['apiKey'];
        delete body['verbRedirect'];
        delete body['redirectTo'];


        const response = await Users.update(
            body,
            {
                where: {
                    id: userId,
                    isBlocked: false
                }
        }
        )
        .catch(error => ({error: error.toString()}));;

        if ( response.error  !== undefined ){
            Logger.error("No se pudo editar el perfil del usuario");
            return utils.setErrorResponse("No se pudo editar el perfil del usuario", 461, res);
        }

        utils.setBodyResponse({status: 'Perfil del usuario actualizado'},
            201,
            res);

    }
}

module.exports = {
    ProfileService
}
