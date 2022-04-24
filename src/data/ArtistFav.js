const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');
const Users = require("./Users");

const ArtistFav = database.define('artistfav', {
    /*
    idArtist: {
        type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        primaryKey: true
    },
    idListener: {
        type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        primaryKey: true
    },*/
    idArtist: models => {
            Users.belongsToMany(models.Users, { through: ArtistFav, foreignKey: 'id'})
        },
    idListener: models => {
            Users.belongsToMany(models.Users, { through: ArtistFav, foreignKey: 'id'})
        }
    });

//Users.belongsToMany(Users, { through: ArtistFav, as: "idArtist", foreignKey: 'id'});
//Users.belongsToMany(Users, { through: ArtistFav, as: "idListener", foreignKey: 'id'});

module.exports = ArtistFav;
