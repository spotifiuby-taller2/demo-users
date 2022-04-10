const {setBodyResponse, setErrorResponse} = require("../others/utils");
const constants = require("../others/constants");
const Users = require("../data/Users");
const Logger = require("./Logger");
const utils = require("../others/utils");
const {Op} = require("sequelize");

class ProfileService {
    defineEvents(app) {
        /**
         * @swagger
         * /users/profile:
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
         *           description: "Returning profile."
         *
         *         "461":
         *           description: "User does not exist."
         */
        app.get( constants.PROFILE_URL,
            this.getProfile
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

        if (user.error) {
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
}

module.exports = {
    ProfileService
}
