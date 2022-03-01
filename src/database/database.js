const Sequelize = require('sequelize');
const Constants = require("../others/constants");

const database = new Sequelize(Constants.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  operatorsAliases: Sequelize.Op,
  define: { timestamp: false },
  ssl: true,
  pool: {
    max: 100,
    min: 0,
    idle: 200000,
    acquire: 1000000
  },
  dialectOptions: {},
} );

module.exports = database;
