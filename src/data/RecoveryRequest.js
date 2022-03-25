const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');

const RecoveryRequests = database.define('recovery_request', {
    userId: {
        type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
    }
} );

module.exports = RecoveryRequests;

