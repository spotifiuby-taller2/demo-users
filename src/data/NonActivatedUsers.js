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
    },

    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },

    isExternal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    pin:{
        type: Sequelize.STRING(constants.PIN_LEN),
        allowNull: false,
    },
    phoneNumber:{
        type: Sequelize.STRING(constants.PHONE_NUMBER_LEN),
        allowNull: false,
        defaultValue: ''
    },
    username:{
        type: Sequelize.STRING(constants.NAME_MAX_LEN),
        allowNull: false,
        defaultValue: 'Anonimo'
    },
    isArtist:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isListener:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isBand:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    latitude:{
        type: Sequelize.DECIMAL(8, 6),
        defaultValue: null
    },
    longitude:{
        type: Sequelize.DECIMAL(9, 6),
        defaultValue: null
    },

    metal: {
        type: Sequelize.BOOLEAN
    },

    rap: {
        type: Sequelize.BOOLEAN
    },

    pop: {
        type: Sequelize.BOOLEAN
    },

    classic: {
        type: Sequelize.BOOLEAN
    },

    electronic: {
        type: Sequelize.BOOLEAN
    },

    jazz: {
        type: Sequelize.BOOLEAN
    },

    reggeaton: {
        type: Sequelize.BOOLEAN
    },

    indie: {
        type: Sequelize.BOOLEAN
    },

    punk: {
        type: Sequelize.BOOLEAN
    },

    salsa: {
        type: Sequelize.BOOLEAN
    },

    blues: {
        type: Sequelize.BOOLEAN
    },

    rock: {
        type: Sequelize.BOOLEAN
    },

    other: {
        type: Sequelize.BOOLEAN
    },
});

module.exports = NonActivatedUsers;

