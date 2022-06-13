const constants = require("../others/constants");
const {Users, } = require("../data/Users");
const {ArtistsBands} = require("../data/ArtistsBands")
const Logger = require("./Logger");
const utils = require("../others/utils");
const {Op} = require("sequelize");

class MusicBandService {
  defineEvents(app) {
    /**
     * @swagger
     * /users/band:
     *   post:
     *    summary: create band.
     *
     *    description: create a band for an artist.
     *
     *    parameters:
     *         - name: "name"
     *           in: body
     *           type: "string"
     *           required: true
     *         - name: "members"
     *           in: body
     *           type: "list"
     *           required: true
     *
     *    responses:
     *         "200":
     *           description: "Return band created correctly"
     *
     *         "491":
     *           description: "A band with that name already exist."
     *         
     *         "591":
     *           description: "Error while creating the band."
     */
    app.post(constants.BAND_URL,
      this.createBand.bind(this));

    /**
     * @swagger
     * /users/band:
     *   get:
     *    summary: get bands.
     *
     *    description: get all bands.
     *
     *    responses:
     *         "200":
     *           description: "Return band created correctly"
     *         
     *         "592":
     *           description: "Error while getting all the band."
     */
     app.get(constants.BAND_URL,
        this.getAllMembers.bind(this));

  }

  async createBand(req, res){

    Logger.info("Request a /users/band");

    const {bandId, members} = req.body;

    const finBand = await ArtistsBands.destroy(
        {
            where: {
                idBand: bandId
            },
        }
    ).catch(err => ({ error: err.toString()}));

    if ( finBand?.error !== undefined && finBand?.error !== 'SequelizeDatabaseError: column "idband" does not exist' ){
        return utils.setErrorResponse("Ha ocurrido un error al crear la banda, intente mas tarde,",591, res );
    }

    const enabledMembers = await this.filterArtists(members);
    const bandCreatedRes = await this.addMembers(enabledMembers, bandId);

    if ( bandCreatedRes?.error !== undefined ){
        return utils.setErrorResponse("Ha ocurrido un error al crear la banda, intente mas tarde,",591, res );
    }

    return utils.setBodyResponse({status: `Integrantes agregados.`}, 200, res); 

  }

  async filterArtists(artistList){
    let unblockedArtists = [];

    const response = await Users.findAll(
        {
            where: {[Op.and]: {id: artistList, isBlocked: false, isArtist: true, isBand: false}}
        }
    );

    response.forEach(artist => { unblockedArtists.push(artist.id) })
        
    

    return unblockedArtists;
  }

  async addMembers(members, bandId){

    let input = [];

    members.forEach((anArtist) => {

         input.push({idBand: bandId, idArtist: anArtist});
        
    });

    const response = await ArtistsBands.bulkCreate(input);

    return response;
    }

  async getAllMembers(req, res){

    Logger.info("Request a /users/band");
    
    const {userId, limit} = req.query;
    const queryLimit = limit
      ? Number(req.query.limit)
      : constants.MAX_LIMIT;

    const artistsList = await Users.findAll({
      limit: queryLimit,
      include: [
        {
          model: Users,
          as: "artist",
          where: {
            id: userId,
          }
        },
      ],
      
    }).catch((error) => ({ error: error.toString() }));

    if ( artistsList?.error !== undefined ){
      return utils.setErrorResponse("Ha ocurrido un error al al obtener los integrantes, intente mas tarde,",591, res );
  }


    const response = {list: artistsList};

    return utils.setBodyResponse(response, 201, res);

  }
}

module.exports = {
  MusicBandService
}
