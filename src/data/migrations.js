const constants = require('../others/constants');
const database = require('./database');
const Sequelize = require('sequelize');
const queryInterface = database.getQueryInterface();

async function runMigrations() {
    /* ================ EJEMPLOS ===================== */
    /* await queryInterface.removeColumn('users',
                                  'isAdmin');
                       .catch(e => {
                        console.log(e);
                       } );*/

    /* await queryInterface.addColumn('users',
                                  'isAdmin');
                       .catch(e => {
                        console.log(e);
                       } );*/


    await queryInterface.addColumn('non_activated_users',
                                   'pin', {
                                      type: Sequelize.STRING(constants.PIN_LEN),
                                      allowNull: false,
                                      defaultValue: false
                                    } )
                        .catch(error => {
                          console.log( error.toString() );
                        } );

    await queryInterface.addColumn('non_activated_users',
                                   'phoneNumber', {
                                      type: Sequelize.STRING(constants.PHONE_NUMBER_LEN),
                                      allowNull: false,
                                      defaultValue: ''
                                    } )
                        .catch(error => {
                          console.log( error.toString() );
                        } );

    await queryInterface.addColumn('users',
                                  'phoneNumber', {
                                    type: Sequelize.STRING(constants.PHONE_NUMBER_LEN),
                                    allowNull: false,
                                    defaultValue: ''
                                  } )
                      .catch(error => {
                        console.log( error.toString() );
                      } );
}

module.exports = {
    runMigrations
}
