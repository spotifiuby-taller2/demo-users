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
                                    defaultValue: null
                                  } )
                      .catch(error => {
                        console.log( error.toString() );
                      } );

    await queryInterface.addColumn('users',
                                  'name', {
                                    type: Sequelize.STRING(constants.NAME_MAX_LEN),
                                    allowNull: false,
                                    defaultValue: 'Anonimo'
                                  } )
                      .catch(error => {
                        console.log( error.toString() );
                      } );

    await queryInterface.addColumn('users',
                                'surname', {
                                  type: Sequelize.STRING(constants.NAME_MAX_LEN),
                                  allowNull: false,
                                  defaultValue: 'Anonimo'
                                } )
                    .catch(error => {
                      console.log( error.toString() );
                    } );
    
    await queryInterface.addColumn('users',
                                    'isArtist',
                                    {
                                      type: Sequelize.BOOLEAN,
                                      allowNull: false,
                                      defaultValue: false
                                    })
                      .catch(e => {
                        console.log(e);
                      } );

    await queryInterface.addColumn('users',
                                    'isListener',
                                    {
                                      type: Sequelize.BOOLEAN,
                                      allowNull: false,
                                      defaultValue: false
                                    })
                      .catch(e => {
                        console.log(e);
                      } );

    await queryInterface.addColumn('users',
                                    'latitude',
                                    {
                                      type: Sequelize.DECIMAL(8, 6),
                                      defaultValue: null
                                    })
                      .catch(e => {
                        console.log(e);
                      } );

    await queryInterface.addColumn('users',
                                  'longitude',
                                  {
                                    type: Sequelize.DECIMAL(9, 6),
                                    defaultValue: null
                                  })
                    .catch(e => {
                      console.log(e);
                    } );

    await queryInterface.addColumn('non_activated_users',
                                  'name', {
                                    type: Sequelize.STRING(constants.NAME_MAX_LEN),
                                    allowNull: false,
                                    defaultValue: 'Anonimo'
                                  } )
                      .catch(error => {
                        console.log( error.toString() );
                      } );

    await queryInterface.addColumn('non_activated_users',
                                'surname', {
                                  type: Sequelize.STRING(constants.NAME_MAX_LEN),
                                  allowNull: false,
                                  defaultValue: 'Anonimo'
                                } )
                    .catch(error => {
                      console.log( error.toString() );
                    } );
    
    await queryInterface.addColumn('non_activated_users',
                                    'isArtist',
                                    {
                                      type: Sequelize.BOOLEAN,
                                      allowNull: false,
                                      defaultValue: false
                                    })
                      .catch(e => {
                        console.log(e);
                      } );

    await queryInterface.addColumn('non_activated_users',
                                    'isListener',
                                    {
                                      type: Sequelize.BOOLEAN,
                                      allowNull: false,
                                      defaultValue: false
                                    })
                      .catch(e => {
                        console.log(e);
                      } );

    await queryInterface.addColumn('non_activated_users',
                                    'latitude',
                                    {
                                      type: Sequelize.DECIMAL(8, 6),
                                      defaultValue: null
                                    })
                      .catch(e => {
                        console.log(e);
                      } );

    await queryInterface.addColumn('non_activated_users',
                                  'longitude',
                                  {
                                    type: Sequelize.DECIMAL(9, 6),
                                    defaultValue: null
                                  })
                    .catch(e => {
                      console.log(e);
                    } );

    // Genres
    await queryInterface.addColumn('non_activated_users',
        'metal', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'rap', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'pop', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'classic', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'electronic', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'jazz', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'reggeaton', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'indie', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'punk', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'salsa', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'blues', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'rock', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('non_activated_users',
        'other', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'metal', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'rap', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'pop', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'classic', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'electronic', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'jazz', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'reggeaton', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'indie', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'punk', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'salsa', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'blues', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'rock', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'other', {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        } )
        .catch(error => {
            console.log( error.toString() );
        } );

    await queryInterface.addColumn('users',
        'walletId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: { notEmpty: true },
            unique: true
        } )
        .catch(error => {
            console.log( error.toString() );
        } );
}

module.exports = {
    runMigrations
}
