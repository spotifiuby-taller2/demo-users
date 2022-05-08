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
    /*
    await queryInterface.addColumn('users',
                                  'isAdmin',{
                                      type: Sequelize.BOOLEAN,
                                      allowNull: false,
                                      defaultValue: false
                                  })
                       .catch(e => {
                        console.log(e);
                       } );*/

    await queryInterface.changeColumn('users ',
        'walletId', {
            type: Sequelize.INTEGER,
            unique: true
        }, )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'photoUrl', {
            type: Sequelize.STRING(constants.MAX_STR_LEN)
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'pushNotificationToken', {
            type: Sequelize.STRING(constants.MAX_STR_LEN)
        } )
        .catch(error => {
            console.log( error.toString() );
        } );
}

module.exports = {
    runMigrations
}
