const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');

const Restaurants = database.define("restaurants", {
   name: {
       type: Sequelize.STRING(constants.NAME_MAX_LEN),
       allowNull: false,
       defaultValue: 'Anonimo'
   }
});

module.exports = {
    Restaurants
};
