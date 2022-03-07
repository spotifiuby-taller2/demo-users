const Sequelize = require('sequelize');
const constants = require("../others/constants");

const database = new Sequelize(constants.databaseUrl, {
  dialect: 'postgres',

  logging: false,

  operatorsAliases: Sequelize.Op,

  define: {
    timestamp: false
  },

  ssl: {
    rejectUnauthorized: false
  },

  pool: {
    max: 100,
    min: 0,
    idle: 200000,
    acquire: 1000000
  },

  dialectOptions: {},
} );

module.exports = database;
