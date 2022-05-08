const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');

const Users = database.define('users', {
    email: {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
    },

    password: {
        type: Sequelize.STRING(constants.SHA_LEN),
        allowNull: false,
        validate: { notEmpty: true }
    },

    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },

    isConfirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },

    phoneNumber:{
        type: Sequelize.STRING(constants.PHONE_NUMBER_LEN),
        allowNull: false,
        defaultValue: ''
    },
    name:{
        type: Sequelize.STRING(constants.NAME_MAX_LEN),
        allowNull: false,
        defaultValue: 'Anonimo'
    },
    surname:{
        type: Sequelize.STRING(constants.NAME_MAX_LEN),
        allowNull: false,
        defaultValue: 'Anonimo'
    },
    photoUrl: {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
    }
} );

module.exports = {
    Users
};
