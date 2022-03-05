const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');

const NonActivatedUsers = database.define('non_activated_users', {
    id: {
        primaryKey: true,
        type: Sequelize.STRING(constants.BCRYPT_LEN),
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

module.exports = NonActivatedUsers;

