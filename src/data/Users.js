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
    isArtist:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    isListener:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    latitude:{
        type: Sequelize.DECIMAL(8, 6),
        defaultValue: null
    },
    longitude:{
        type: Sequelize.DECIMAL(9, 6),
        defaultValue: null
    },
    walletId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: { notEmpty: true },
        unique: true
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
} );

module.exports = Users;
