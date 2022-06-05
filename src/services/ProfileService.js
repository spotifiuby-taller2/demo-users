const {setBodyResponse, setErrorResponse} = require("../others/utils");
const constants = require("../others/constants");
const {Users, ArtistFav} = require("../data/Users");
const Logger = require("./Logger");
const utils = require("../others/utils");
const {Op} = require("sequelize");

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
     *    summary: get user name, surname and type.
     *
     *    description: get user name, surname and type.
     *
     *    parameters:
     *         - name: "id"
     *           in: query
     *           type: "string"
     *           required: true
     *
     *    responses:
     *         "200":
     *           description: "return user name, surname and type."
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
  }

  async getProfile(req, res) {
    Logger.info("Request a /users/profile");

    const userId = req.query.userId;

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
      return setErrorResponse("El usuario no existe.",
        400,
        res);
    }

    const profileResponse = {
      'id': user.id,
      'email': user.email,
      'phoneNumber': user.phoneNumber,
      'name': user.name,
      'surname': user.surname,
      'isArtist': user.isArtist,
      'isListener': user.isListener,
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
      'subscription': user.subscription
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
        return utils.setErrorResponse(followers.error, 481, res);
      }

      profileResponse['nFollowers'] = followers.length;

    }

    return setBodyResponse(profileResponse, 200, res);
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
      return setErrorResponse("El usuario no existe.",
        400,
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
      return setErrorResponse("El usuario no existe.",
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

    return setBodyResponse({status: 'Foto de perfil actualizada'}, 200, res);
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
        name: user.name,
        surname: user.surname,
        subscription: user.subscription
      },
      201,
      res);

  }

  async editProfile(req, res) {

    Logger.info("Request a /users/editprofile");

    const userId = req.query.userId;
    const body = req.body;

    delete body.apiKey;
    delete body.verbRedirect;
    delete body.redirectTo;


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


    if (response.error !== undefined) {
      Logger.error("No se pudo editar el perfil del usuario");
      return utils.setErrorResponse("No se pudo editar el perfil del usuario", 461, res);
    }

    utils.setBodyResponse({status: 'Perfil del usuario actualizado'},
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
      return setErrorResponse("El usuario no existe.",
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
      return setErrorResponse(`No se pudo actualizar el push notification token del usuario ${userId}`,
        500,
        res);
    }


    utils.setBodyResponse({status: 'Push notification token actualizado'},
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
      return setErrorResponse("El usuario no existe.", 400, res);
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
    return setBodyResponse({status: 'Video de verificacion actualizado'}, 200, res);
  }
}

module.exports = {
  ProfileService
}
