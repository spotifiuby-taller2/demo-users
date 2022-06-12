const {setBodyResponse} = require("../others/utils");
const {Users} = require("../data/Users");
const constants = require("../others/constants");
const Logger = require("./Logger");

class ParseService {
    defineEvents(app) {
        /**
         * @swagger
         * /users/parse:
         *   post:
         *    summary: Parse user list.
         *
         *    description: Return list of users with their info.
         *
         *    responses:
         *         "200":
         *           description: "Returning list of users."
         */
        app.post(constants.PARSE_USERS_URL,
                this.parseUsers
                    .bind(this));
    }

    async parseUsers(req,
                    res) {
      Logger.info("Request a /parse");
      const usersIds = req.body
                          .usersIds;

      const users = [];

      for (const userId of usersIds) {
          const user = await Users.findOne( {
                              where: {
                                id: userId
                              } } );

            users.push({
                id: user.id,
                email: user.email,
                username: user.username,
                isArtist: user.isArtist,
                isListener: user.isListener,
                isBand: user.isBand,
                photoUrl: user.photoUrl
            })
      }

      return setBodyResponse(users,
                            200,
                            res);
    };
}

module.exports = {
    ParseService
}
