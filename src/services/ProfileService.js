const {setBodyResponse, setErrorResponse} = require("../others/utils");
const constants = require("../others/constants");
const Users = require("../data/Users");
const Logger = require("./Logger");
const utils = require("../others/utils");
const {Op} = require("sequelize");
const bodyParser = require("body-parser");

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
                'other':  user.other
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
}

module.exports = {
    ProfileService
}
