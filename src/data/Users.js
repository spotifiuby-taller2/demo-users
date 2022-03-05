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
    }
} );

module.exports = Users;
