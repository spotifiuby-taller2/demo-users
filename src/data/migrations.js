const constants = require('../others/constants');
const database = require('./database');
const Sequelize = require('sequelize');
const queryInterface = database.getQueryInterface();

async function runMigrations() {
  /* ================ EXAMPLES ===================== */
  /* await queryInterface.removeColumn('users',
                                'isAdmin');
                     .catch(e => {
                      console.log(e);
                     } ); */

  await queryInterface.addColumn('users',
    'subscription', {
      type: Sequelize.STRING(constants.MAX_STR_LEN),
      allowNull: false,
      unique: false,
      defaultValue: 'free'
    })
    .catch(e => {
      console.log(e);
    });

  /* await queryInterface.changeColumn('users ',
    'walletId', {
      type: Sequelize.INTEGER,
      unique: true
    },)
    .catch(error => {
      console.log(error.toString());
    });*/
}

module.exports = {
  runMigrations
}
