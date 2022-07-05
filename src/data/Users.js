const database = require('./database');
const Sequelize = require('sequelize');
const constants = require('../others/constants');


const today = new Date();
const lastPayementDateDefault = today.setMonth(today.getMonth() - 1);

const Users = database.define('users', {
  id: {
    primaryKey: true,
    type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    unique: true
  },

  email: {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    unique: true
  },

  password: {
    type: Sequelize.STRING(constants.SHA_LEN),
    allowNull: false,
    validate: {notEmpty: true}
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
  phoneNumber: {
    type: Sequelize.STRING(constants.PHONE_NUMBER_LEN),
    allowNull: false,
    defaultValue: ''
  },
  username: {
    type: Sequelize.STRING(constants.NAME_MAX_LEN),
    allowNull: false,
    defaultValue: 'Anonimo'
  },
  isArtist: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isListener: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isBand:{
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  latitude: {
    type: Sequelize.DECIMAL(8, 6),
    defaultValue: null
  },
  longitude: {
    type: Sequelize.DECIMAL(9, 6),
    defaultValue: null
  },

  walletId: {
    type: Sequelize.INTEGER,
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
  photoUrl: {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
  },
  pushNotificationToken: {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  verificationVideoUrl: {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
  },
  subscription: {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: false,
    unique: false,
    defaultValue: 'free'
  },
  lastPaymentDate:{
    type: Sequelize.DATE,
    allowNull: true,
    unique: false,
    defaultValue: lastPayementDateDefault,
  }
});

const ArtistFav = database.define('artistfavs', {
  idArtist: {
    type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    primaryKey: true,
    references: {
      model: Users, // <----- name of the table
      key: 'id'
    }
  },
  idListener: {
    type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    primaryKey: true,
    references: {
      model: Users, // <----- name of the table
      key: 'id'
    }
  }
});

const Notifications = database.define('notifications', {
  idEmissor: {
    type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    references: {
      model: Users, // <----- name of the table
      key: 'id'
    }
  },
  idReceptor: {
    type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    references: {
      model: Users, // <----- name of the table
      key: 'id'
    }
  }
});


Users.belongsToMany(Users, {through: ArtistFav, as: "idArtist", foreignKey: 'idArtist'});
Users.belongsToMany(Users, {through: ArtistFav, as: "idListener", foreignKey: 'idListener'});
Users.belongsToMany(Users, {through: Notifications, as: "idEmissor", foreignKey: 'idReceptor'});
Users.belongsToMany(Users, {through: Notifications, as: "idReceptor", foreignKey: 'idEmissor'});


module.exports = {Users, ArtistFav, Notifications};
