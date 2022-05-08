const constants = require('../others/constants');
const database = require('./database');
const Sequelize = require('sequelize');
const {getFormatedDate} = require("../others/constants");
const queryInterface = database.getQueryInterface();

async function runMigrations() {
    /* ================ EXAMPLES ===================== */
    /* await queryInterface.removeColumn('pediya_db',
                                  'isAdmin');
                       .catch(e => {
                        console.log(e);
                       } );*/
    /*
    await queryInterface.addColumn('pediya_db',
                                  'isAdmin',{
                                      type: Sequelize.BOOLEAN,
                                      allowNull: false,
                                      defaultValue: false
                                  })
                       .catch(e => {
                        console.log(e);
                       } );*/

    const dateNow = new Date();

    await queryInterface.bulkInsert('users', [ {
        email: "admin@admin.com",
        password: "0bdbc9bd9aea59609f282d153eae4f1bc5d06cb4c38e57cc28c27bb4e7aca924",
        isAdmin: true,
        isConfirmed: true,
        phoneNumber: "",
        name: "Admin",
        surname: "Admin",
        photoUrl: "/media",
        createdAt: dateNow,
        updatedAt: dateNow,
    } ] ).catch(error => console.log(error.toString()));

    await queryInterface.bulkInsert('restaurants', [ {
        name: "Un restaurant",
        createdAt: dateNow,
        updatedAt: dateNow,
    } ] ).catch(error => console.log(error.toString()));
}

module.exports = {
    runMigrations
}
