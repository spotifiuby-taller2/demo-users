const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');

const Users = database.define('users', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
    },

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

    isBlocked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },

    isExternal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    phoneNumber:{
        type: Sequelize.STRING(constants.PHONE_NUMBER_LEN),
        allowNull: false,
    }
} );

module.exports = Users;
