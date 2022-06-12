const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');
const { Users } = require('./Users');

const ArtistsBands = database.define('artistbands', {
  idBand: {
    primaryKey: true,
    type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    references: {
        model: Users, // <----- name of the table
        key: 'id'
    }
  },

  idArtist: {
    type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
    primaryKey: true,
    allowNull: false,
    validate: {notEmpty: true},
    references: {
        model: Users, // <----- name of the table
        key: 'id'
    }
  },
});

Users.belongsToMany(Users, {through: ArtistsBands, as: "band", foreignKey: 'idBand'});
Users.belongsToMany(Users, {through: ArtistsBands, as: "artist", foreignKey: 'idArtist'});


module.exports = {ArtistsBands};