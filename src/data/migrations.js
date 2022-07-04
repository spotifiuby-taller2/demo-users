const constants = require('../others/constants');
const database = require('./database');
const Sequelize = require('sequelize');
const {Notifications} = require("./Users");
const queryInterface = database.getQueryInterface();


const today = new Date();
const lastPayementDateDefault = today.setMonth(today.getMonth() - 1);

async function runMigrations() {
    await queryInterface.removeConstraint(Notifications.tableName, 'notifications_pkey');
}

module.exports = {
  runMigrations
}
