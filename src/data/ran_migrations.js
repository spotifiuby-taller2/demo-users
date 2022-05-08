const database = require('./database');
const Sequelize = require('sequelize');
const constants = require("../others/constants");
const queryInterface = database.getQueryInterface();

async function ranMigrations() {
    /* Only for old (manual) migrations. */
}

module.exports = {
    ranMigrations
}
