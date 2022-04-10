const {setBodyResponse} = require("../others/utils");
const constants = require("../others/constants");
const Users = require("../data/Users");
const Logger = require("./Logger");
const utils = require("../others/utils");
const {auth} = require("../services/FirebaseService");

class InfoService {
    defineEvents(app) {
        /**
         * @swagger
         * /users/list:
         *   post:
         *    summary: Users list.
         *
         *    description: Return list of users.
         *
         *    responses:
         *         "200":
         *           description: "Returning list."
         */
        app.get( constants.USERS_LIST_URL,
            this.listUsers
                .bind(this) );

        /**
         * @swagger
         * /users/block:
         *   post:
         *    summary: Block user.
         *
         *    description: block the user with the given id.
         *
         *    parameters:
         *         - name: "id"
         *           in: body
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "User blocked."
         *
         *         "461":
         *           description: "User does not exists."
         *
         *         "561":
         *           description: "Error blocking user."
         */
        app.post( constants.USERS_BLOCK_URL,
            this.blockUser
                .bind(this) );

        /**
         * @swagger
         * /users/unlock:
         *   post:
         *    summary: Unlock user.
         *
         *    description: unlock the user with the given id.
         *
         *    parameters:
         *         - name: "id"
         *           in: body
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "User blocked."
         *
         *         "461":
         *           description: "User does not exists."
         *
         *         "561":
         *           description: "Error unlocking user."
         *
         *         "562":
         *           description: "Error creating new user."
         */
        app.post( constants.USERS_UNLOCK_URL,
            this.unlockUser
                .bind(this) );
    }

    async listUsers(req,
                    res) {
        Logger.info("Request a /users/list");

        const users = await Users.findAll();

        const formattedUsers = [];

        users.forEach(user => {
            formattedUsers.push( {
                id: user.dataValues
                        .id,

                email: user.dataValues
                           .email,

                isBlocked: user.dataValues
                               .isBlocked,

                isAdmin: user.dataValues
                              .isAdmin,
            } );
        } );

        const response = {
            users: formattedUsers
        }

        return setBodyResponse(response,
                               200,
                               res);
    }

    async blockUser(req,
                    res) {
        Logger.info("Request a /users/block");

        const idToBlock = req.body
                             .idToBlock;

        const user = await Users.findOne({ where: {
                id: idToBlock
        } }).catch(error => {
            return error.toString();
        } );

        if (user === undefined
            || user === null
            || user.error !== undefined) {
            return setErrorResponse("El usuario no existe",
                                    461,
                                    res);
        }

        const dbResponse = await Users.update({
            isBlocked: true
        }, {
            where: {
                id: idToBlock
         } } ).catch(error => {
            return error.toString();
        } );

        if (dbResponse.error !== undefined) {
            return setErrorResponse("No se pudo actualizar al usuario",
                                    561,
                                    res);
        }

        const response = {
            ok: "ok"
        }

        return setBodyResponse(response,
                                200,
                                res);
    }

    async unlockUser(req,
                     res) {
        Logger.info("Request a /users/unlock");

        const email = req.body
            .email;

        const password = req.body
            .password;

        const response = {
            ok: "ok"
        }

        if (email !== undefined
            && email !== null) {
            const response = await auth.createUser( {
                email: email,
                emailVerified: true,
                password: password,
                disabled: false
            } ).catch(error => ({ error: error.toString() }) );

            if (response.error !== undefined) {
                Logger.error(response.error.toString());

                utils.setErrorResponse(response.error,
                    562,
                    res);

                return;
            }

            const dbResponse = await Users.create( {
                id: response.uid,
                email: email,
                password: password,
                isAdmin: true,
                isBlocked: false,
                isExternal: false
            } ).catch(error => ({ error: error.toString() }) );

            if (dbResponse.error !== undefined) {
                Logger.error(dbResponse.error.toString());

                return utils.setErrorResponse(dbResponse.error,
                    562,
                    res);
            }

            return utils.setBodyResponse(response,
                200,
                res);
        }

        const idToUnlock = req.body
            .idToUnlock;

        const user = await Users.findOne({ where: {
                id: idToUnlock
            } }).catch(error => { return {
            error: error.toString()
        } } );

        if (user === undefined
            || user === null
            || user.error !== undefined) {
            return utils.setErrorResponse("El usuario no existe",
                461,
                res);
        }

        const dbResponse = await Users.update({
            isBlocked: false
        }, {
            where: {
                id: idToUnlock
            } } ).catch(error => {
            return {
                error: error.toString()
            };
        } );

        if (dbResponse.error !== undefined) {
            return utils.setErrorResponse("No se pudo actualizar al usuario",
                561,
                res);
        }

        return utils.setBodyResponse(response,
            200,
            res);
    }
}

module.exports = {
    InfoService
}
