const database = require('./database');
const Sequelize = require('sequelize');
const queryInterface = database.getQueryInterface();

async function runMigrations() {
    /* await queryInterface.removeColumn('users',
                                      'isAdmin');
                           .catch(e => {
                            console.log(e);
                           } );*/

    /* await queryInterface.addColumn('users',
                                   'isAdmin', {
                                      type: Sequelize.BOOLEAN,
                                      allowNull: false,
                                      defaultValue: false
                                    } )
                        .catch(error => {
                          console.log( error.toString() );
                        } ); */
}

module.exports = {
    runMigrations
}
