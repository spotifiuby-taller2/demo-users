const Sequelize = require('sequelize');
const constants = require("../others/constants");

const database = new Sequelize(constants.databaseUrl, {
  dialect: 'postgres',

  logging: false,

  operatorsAliases: Sequelize.Op,

  define: {
    timestamp: false
  },

  ssl: true,

  pool: {
    max: 100,
    min: 0,
    idle: 200000,
    acquire: 1000000
  },

  dialectOptions: {
    ssl: true
  },
} );

module.exports = database;
