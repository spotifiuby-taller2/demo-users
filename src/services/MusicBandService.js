const constants = require("../others/constants");
const {Users, } = require("../data/Users");
const {Bands} = require("../data/Bands");
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
     app.post(constants.BAND_URL,
        this.getAllBands.bind(this));

  }

  async createBand(req, res){

    Logger.info("Request a /users/band");

    const {name, members} = req.body;
    const bandId = utils.getId();

    const finBand = await Bands.findOne(
        {
            where: {
                name: name
            },
        }
    ).catch(err => ({ error: err.toString()}));

    if ( finBand?.error !== undefined ){
        return utils.setErrorResponse("Ha ocurrido un error al crear la banda, intente mas tarde,",591, res );
    }

    if ( finBand !== null ){
        return utils.setErrorResponse("Ya existe una banda con ese nombre. Por favor elija otro.",491, res );
    }

    const response = await Bands.create({
        name: name,
        id: bandId,
    }).catch(err => ({ error: err.toString()}));

    if ( response?.error !== undefined ){
        return utils.setErrorResponse("Ha ocurrido un error al crear la banda, intente mas tarde,",591, res );
    }

    const enabledMembers = await this.filterArtists(members);
    const bandCreatedRes = await this.addMembers(enabledMembers, bandId);

    if ( bandCreatedRes?.error !== undefined ){
        await Bands.destroy({
            where:{
                name: name,
            }
        })
        return utils.setErrorResponse("Ha ocurrido un error al crear la banda, intente mas tarde,",591, res );
    }

    return utils.setBodyResponse({status: `Banda ${name} creada.`}, 200, res); 

  }

  async filterArtists(artistList){
    let unblockedArtists = [];

    const response = await Users.findAll(
        {
            where: {[Op.and]: {id: artistList, isBlocked: false, isArtist: true}}
        }
    );

    response.forEach(artist => { unblockedArtists.push(artist.id) })
        
    

    return unblockedArtists;
  }

  async addMembers(members, bandId){

    let input = [];

    members.forEach( async(anArtist) => {

         input.push({idBand: bandId, idArtist: anArtist});
        
    });

    const response = await ArtistsBands.bulkCreate(input);

    return response;
    }

  async getAllBands(req, res){

    Logger.info("Request a /users/band");
    
    const bandList = await Bands.findAll(
        {
            attributes: ['id', 'photoUrl'],
        }
    ).catch(err => ({error: err.toString()}));

    if ( bandList?.error !== null ){
        return utils.setErrorResponse(
            "Ha ocurrido un error al obtener todas las bandas, intente mas tarde,", 592, res );
    }

    const response = {bands: bandList};

    return utils.setBodyResponse(response, 201, res);

  }
}

module.exports = {
  MusicBandService
}
