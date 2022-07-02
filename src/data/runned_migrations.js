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
}

module.exports = {runMigrations}
