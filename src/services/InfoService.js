const {setBodyResponse} = require("../others/utils");
const constants = require("../others/constants");
const {Users, ArtistFav, Notifications} = require("../data/Users");
const Logger = require("./Logger");
const utils = require("../others/utils");
const {Op} = require("sequelize");
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
         * /users/list:
         *   post:
         *    summary: Artist list.
         *
         *    description: Return list of artists.
         *
         *    responses:
         *         "200":
         *           description: "Returning list."
         * 
         */
         app.get( constants.APP_ARTIST_LIST_URL,
            this.listArtists
                .bind(this) );

        /**
         * @swagger
         * /users/list:
         *   post:
         *    summary: Fav Artist list.
         *
         *    description: Return list of favourite artists.
         *
         *    responses:
         *         "200":
         *           description: "Returning list."
         * 
         *         "571":
         *           description: "Error fetching listener"
         */
         app.get( constants.APP_FAV_ARTIST_LIST_URL,
            this.listFavArtists
                .bind(this) );

        /**
         * @swagger
         * /users/applist:
         *   get:
         *    summary: List app users.
         *
         *    description: Return list of app users.
         *
         *    responses:
         *         "200":
         *           description: "Returning list."
         */
        app.get( constants.APP_USERS_LIST_URL,
            this.listAppUsers
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

        /**
         * @swagger
         * /users/favartist:
         *   post:
         *    summary: add new fav artist.
         *
         *    description: add a new relation favourite artist-listener.
         *
         *    parameters:
         *         - name: "idArtist"
         *           in: body
         *           type: "string"
         *           required: true
         * 
         *         - name: "idListener"
         *           in: body
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "Relation created"
         *
         *         "461":
         *           description: "Artist does not exists."
         * 
         *         "462":
         *           description: "Listener does not exists."
         *
         *         "561":
         *           description: "Error creating relation."
         *
         *     
         */
         app.post( constants.APP_FAV_ARTIST_URL,
            this.addFavArtist
                .bind(this) );


        /**
         * @swagger
         * /users/favartist:
         *   delete:
         *    summary: delete fav artist.
         *
         *    description: delete a pair favourite artist-listener.
         *
         *    parameters:
         *         - name: "idArtist"
         *           in: query
         *           type: "string"
         *           required: true
         * 
         *         - name: "idListener"
         *           in: query
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "Relation deleted"
         *
         *         "461":
         *           description: "Error deleting relation."
         *
         *     
         */
         app.delete( constants.APP_FAV_ARTIST_URL,
            this.deleteFavArtist
                .bind(this) );


        /**
         * @swagger
         * /users/favartist:
         *   get:
         *    summary: get if a pair (fav artist, listener) exists.
         *
         *    description: get if a pair (fav artist, listener) exists.
         *
         *    parameters:
         *         - name: "idArtist"
         *           in: query
         *           type: "string"
         *           required: true
         * 
         *         - name: "idListener"
         *           in: query
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "Pair (artist, listener) exists"
         *     
         */
                app.get( constants.APP_FAV_ARTIST_URL,
                    this.getFavArtist
                        .bind(this) );

        /**
         * @swagger
         * /users/notificationlist:
         *   get:
         *    summary: get user notification list.
         *
         *    description: get user notification list.
         *
         *    parameters:
         *         - name: "idEmissor"
         *           in: query
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "return notification list."
         *
         *         "471":
         *           description: "Emissor does not exists."
         *
         *         "571":
         *           description: "Error returning notification list."
         */
               app.get( constants.NOTIFICATION_LIST_URL,
                    this.getNotificationList
                        .bind(this) );

                
        

        /**
         * @swagger
         * /users/notificationlist:
         *   post:
         *    summary: add a notification.
         *
         *    description: add a notification.
         *
         *    parameters:
         *         - name: "idEmissor"
         *           in: query
         *           type: "string"
         *           required: true
         * 
         *         - name: "idReceptor"
         *           in: query
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "notification added."
         *
         *         "471":
         *           description: "emissor or receptor doesn't exist"
         *
         *     
         */
                app.delete( constants.NOTIFICATION_LIST_URL,
                    this.deleteNotification
                        .bind(this) );

        /**
         * @swagger
         * /users/notificationlist:
         *   post:
         *    summary: add a new notification.
         *
         *    description: add a new notification.
         *
         *    parameters:
         *         - name: "idEmissor"
         *           in: body
         *           type: "string"
         *           required: true
         * 
         *         - name: "idReceptor"
         *           in: body
         *           type: "string"
         *           required: true
         *
         *    responses:
         *         "200":
         *           description: "notification added."
         *
         *         "471":
         *           description: "Emissor doesn't exist"
         *
         *         "472":
         *           description: "Receptor doesn't exist"
         * 
         *         "571":
         *           description: "Error creating notification."
         */
        
                app.post( constants.NOTIFICATION_LIST_URL,
                    this.addNotification
                        .bind(this) );


    }


    getFormattedUsers(users,
                      res) {
        const formattedUsers = [];

        users.forEach(user => {
            formattedUsers.push( {
                id: user.dataValues
                    .id,

                email: user.dataValues
                    .email,

                name: user.dataValues
                    .name,

                surname: user.dataValues
                    .surname,

                isBlocked: user.dataValues
                    .isBlocked,

                isAdmin: user.dataValues
                    .isAdmin,

                isArtist: user.dataValues
                    .isArtist,

                isListener: user.dataValues
                    .isListener,

                isVerified: user.dataValues
                    .isVerified,
                photoUrl: user.dataValues
                    .photoUrl
            } );
        } );

        const response = {
            list: formattedUsers
        }

        return setBodyResponse(response,
            200,
            res);
    }

    async listUsers(req,
                    res) {
        Logger.info("Request a /users/list");

        const users = await Users.findAll();

        return this.getFormattedUsers(users,
                                      res);
    }

    async listArtists(req, res) {
        Logger.info("Request a /users/artistlist");

        const users = await Users.findAll(
            {
                where: {
                    isArtist: true,
                    isBlocked: false
                }
            } 
        );

        return this.getFormattedUsers(users,
                                res);
    }

    async listFavArtists(req, res) {
        Logger.info("Request a /users/favartistlist");
        
        const listenerId = req.query.userId;
        const limit = Number(req.query.limit);

        const queryLimit = req.query.limit ? {limit : limit}: {};

        const artists = await Users.findAll(
            {
                include: [{
                    model: Users,
                    as: "idArtist",
                    where:{
                        id: listenerId
                    },
                }],
                queryLimit
            } 
        )
        .catch(error => ({error: error.toString()}));

        if (artists.error !== undefined) {
            Logger.error(artists.error.toString());

            return utils.setErrorResponse(artists.error,
                571,
                res);

        }
    
        return this.getFormattedUsers(artists,
                                res);
    }

    async listAppUsers(req,
                       res) {
        Logger.info("Request a /users/applist");

        const users = await Users.findAll({
            where: {
                isAdmin: false,
                isBlocked: false
            }
        } );

        return this.getFormattedUsers(users,
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

        Logger.info("Usuario bloqueado: " + idToBlock);

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

            Logger.info("Usuario creado con email y contraseña: " + response.uid);

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



    async addFavArtist(req, res){

        Logger.info("Request a /users/favartist");

        const {idArtist, idListener} = req.body;

        let response = await  Users.findOne(
            {
                where: {[Op.and]: [{id: idArtist}, {isBlocked: false}, {isArtist: true}]}
            }
        );

        if (response === null) {
            Logger.error(`No existe el artista ${idArtist}`);
    
            return utils.setErrorResponse(`No existe el artista ${idArtist}`,
                461,
                res);
        }

        response = await Users.findOne(
            {
                where: {[Op.and]: [{id: idListener}, {isBlocked: false}, {isListener: true}]}
            }
        );

        if (response === null) {
            Logger.error(`No existe el oyente ${idListener}`);
    
            return utils.setErrorResponse(`No existe el oyente ${idListener}`,
                462,
                res);
        }

        response = await ArtistFav.create(
            {
                idArtist: idArtist,
                idListener: idListener
            }
        ).catch(error => {
            return { error: "No se ha podido crear la relación Oyente tiene como favorito a artista."}
        } );
    
        if (response.error !== undefined) {
            Logger.error(response.error.toString());
    
            return utils.setErrorResponse(response.error,
                561,
                res);
        }

        Logger.info(`El Oyente ${idListener} ha agregado como favorito a ${idArtist}.`);

        utils.setBodyResponse({status: 'Nuevo favorito agregado'},
            201,
            res);
    }

    async deleteFavArtist(req, res){

        Logger.info("Request a /users/favartist");

        const idListener = req.query.idListener;
        const idArtist = req.query.idArtist;


        const response = await ArtistFav.destroy(
            {
                where: {[Op.and]: [{idListener: idListener}, {idArtist: idArtist}]}
            }
        )

        if (response === 0){
            Logger.error(`El par oyente-artista que se quiere eliminar no existe`);
    
            return utils.setErrorResponse(`El par oyente-artista que se quiere eliminar no existe`,
                461,
                res);
        }

        Logger.info(`El Oyente ${idListener} ha borrado como favorito a ${idArtist}.`);

        utils.setBodyResponse({status: 'Favorito eliminado'},
            201,
            res);
    }

    async getFavArtist(req, res){

        Logger.info("Request a /users/favartist");

        const idListener = req.query.idListener;
        const idArtist = req.query.idArtist;


        ArtistFav.findOne(
            {
                where: {[Op.and]: [{idListener: idListener},{idArtist: idArtist}]}
            }
        )
        .then(user =>{
            
            if ( user !== null){
                Logger.info(`par (${idListener} , ${idArtist}) existe.`);
    
                utils.setBodyResponse({status: true},
                        201,
                        res);
            }
            else{
                Logger.info(`par (${idListener} , ${idArtist}) no existe.`);
    
                utils.setBodyResponse({status: false},
                        201,
                        res);
            }

        })
        .catch(error => {

            const err = error.toString();
            Logger.error(err);
            utils.setErrorResponse(err,
                571,
                res)
        });

    }


    async deleteNotification(req, res){

        Logger.info("Request a /users/notificationlist");

        const idEmissor = req.query.idEmissor;
        const idReceptor = req.query.idReceptor;

        const response = await Notifications
            .destroy({
                where: {[Op.and]: [{idEmissor: idEmissor}, {idReceptor: idReceptor}]}
            })
            .catch(err => {
                return {error: err.toString()}
            });

        if ( response.error !== undefined ){
            return utils.setErrorResponse('Error al destruir la notificación',571,res);
        }
        else if ( response === 0 ){
            return utils.setErrorResponse('La notificación no existe',471,res);
        }

        Logger.info(`La notificación ha sido borrada con exito.`);

        utils.setBodyResponse({status: 'Notificación eliminada.'},
            201,
            res);
    }

    async addNotification(req, res){
        Logger.info("Request a /users/notificationlist");

        const idEmissor = req.body.idEmissor;
        const idReceptor = req.body.idReceptor;

        const response = await Notifications
            .create({
                idEmissor: idEmissor,
                idReceptor: idReceptor
            })
            .catch(err => {
                return {error: err.toString()}
            });
        

        if ( response.error !== undefined ){
            return utils.setErrorResponse(response.error,471,res);
        }

        Logger.info(`La notificación ha sido creada con exito.`);

        utils.setBodyResponse({status: 'Notificación eliminada.'},
            201,
            res);
    }


    async getNotificationList(req, res){
        Logger.info("Request a /users/notificationlist");

        const idEmissor = req.query.idEmissor;

        let emissor = await Users.findOne(
            {
                where: {[Op.and]: [{id: idEmissor},{isBlocked: false}]}
            }
        ).catch(err => {return {error: err.toString()}});

        if (  emissor === null ){
            
            return utils.setErrorResponse('No existe el emisor',471,res);
        }

        const receivers = await Users.findAll(
            {
                include: [{
                    model: Users,
                    as: "idEmissor",
                    where:{
                        id: idEmissor
                    }
                }],
            } 
        )
        .catch(error => ({error: error.toString()}));

        if ( receivers === null ){
            
            return utils.setErrorResponse('No se encontraron totificaciones',472,res);
        }

        const notifications = []

        receivers.forEach( receiver =>{

            const notification = {
                idEmissor: idEmissor,
                idReceptor: receiver.id,
                nameEmissor: emissor.name,
                surnameEmissor: emissor.surname,
                nameReceptor: receiver.name,
                surnameReceptor: receiver.surname,
                pushNotificationToken: receiver.pushNotificationToken
            }

            notifications.push(notification);

        } )


        const response = {
            notifications: notifications
        }

        utils.setBodyResponse(response,200, res);

    }
}

module.exports = {
    InfoService
}
