const Sequelize = require('sequelize');
const constants = require("../others/constants");

const database = new Sequelize(constants.databaseUrl, {
  dialect: 'postgres',

  logging: false,

  operatorsAliases: Sequelize.Op,

  define: {
    timestamp: false
  },

  ssl: (process.env.MY_ENV === '.production') ? {
    rejectUnauthorized: false
  } : false,

  pool: {
    max: 100,
    min: 0,
    idle: 200000,
    acquire: 1000000
  },

  dialectOptions: {
    ssl: (process.env.MY_ENV === '.production') ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
} );

module.exports = database;
