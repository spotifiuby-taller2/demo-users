const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');

const Bands = database.define('bands', {
  id: {
    primaryKey: true,
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    unique: true
  },

  name: {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    unique: true
  },
  photoUrl: {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: true,
  }
});


module.exports = {Bands};
