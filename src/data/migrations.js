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

    await queryInterface.addColumn('users',
    'username', {
      type: Sequelize.STRING(constants.NAME_MAX_LEN),
      allowNull: false,
      defaultValue: 'Anonimo'
    })
    .catch(e => {
      console.log(e);
    });

    await queryInterface.addColumn('non_activated_users',
      'username', {
        type: Sequelize.STRING(constants.NAME_MAX_LEN),
        allowNull: false,
        defaultValue: 'Anonimo'
      })
      .catch(e => {
        console.log(e);
      });

    await queryInterface.removeColumn('users',
      'name', {
        type: Sequelize.STRING(constants.NAME_MAX_LEN),
        allowNull: false,
        defaultValue: 'Anonimo'
      })
      .catch(e => {
        console.log(e);
      });

    await queryInterface.removeColumn('users',
      'surname', {
        type: Sequelize.STRING(constants.NAME_MAX_LEN),
        allowNull: false,
        defaultValue: 'Anonimo'
      })
      .catch(e => {
        console.log(e);
      });

      await queryInterface.removeColumn('non_activated_users',
      'name', {
        type: Sequelize.STRING(constants.NAME_MAX_LEN),
        allowNull: false,
        defaultValue: 'Anonimo'
      })
      .catch(e => {
        console.log(e);
      });

    await queryInterface.removeColumn('non_activated_users',
      'surname', {
        type: Sequelize.STRING(constants.NAME_MAX_LEN),
        allowNull: false,
        defaultValue: 'Anonimo'
      })
      .catch(e => {
        console.log(e);
      });

      await queryInterface.addColumn('users',
      'isBand', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      })
      .catch(e => {
        console.log(e);
      });
  
      await queryInterface.addColumn('non_activated_users',
        'isBand', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
