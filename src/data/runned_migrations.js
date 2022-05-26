const database = require('./database');
const Sequelize = require('sequelize');
const constants = require("../others/constants");
const queryInterface = database.getQueryInterface();

async function runMigrations() {
  await queryInterface.changeColumn('users ',
      'walletId', {
        type: Sequelize.INTEGER,
        unique: true
      },)
      .catch(error => {
        console.log(error.toString());
      });

  await queryInterface.addColumn('users',
      'photoUrl', {
        type: Sequelize.STRING(constants.MAX_STR_LEN)
      })
      .catch(error => {
        console.log(error.toString());
      });

  await queryInterface.addColumn('users',
      'pushNotificationToken', {
        type: Sequelize.STRING(constants.MAX_STR_LEN)
      })
      .catch(error => {
        console.log(error.toString());
      });

  await queryInterface.addColumn('users',
      'isVerified', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
      .catch(error => {
        console.log(error.toString());
      });

  await queryInterface.addColumn('users',
      'verificationVideoUrl', {
        type: Sequelize.STRING(constants.MAX_STR_LEN)
      })
      .catch(error => {
        console.log(error.toString());
      });
}

module.exports = {runMigrations}
