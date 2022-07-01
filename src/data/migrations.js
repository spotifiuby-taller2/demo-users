const constants = require('../others/constants');
const database = require('./database');
const Sequelize = require('sequelize');
const queryInterface = database.getQueryInterface();


const today = new Date();
const lastPayementDateDefault = today.setMonth(today.getMonth() - 1);

async function runMigrations() {
  /* ================ EXAMPLES ===================== */
  /* await queryInterface.removeColumn('users',
                                'isAdmin');
                     .catch(e => {
                      console.log(e);
                     } ); */

  await queryInterface.addColumn('users',
      'lastPaymentDate', {
        type: Sequelize.DATE,
        allowNull: true,
        unique: false,
        defaultValue: lastPayementDateDefault,
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
