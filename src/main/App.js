const database = require('../data/database');
const SignUpService = require('../services/SignUpService');
const SignInService = require('../services/SignInService');
const { ProfileService } = require('../services/ProfileService');
const constants = require('../others/constants');
const cors = require('cors');
const express = require('express');
const bodyParser = require("body-parser");
const Logger = require("../services/Logger");
const { runMigrations } = require("../data/migrations");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const ForgotPassword = require("../services/ForgotPassword");
const { swaggerConfig } = require('./swaggerConfig');
const { InfoService } = require("../services/InfoService");

const swaggerDoc = swaggerJsDoc(swaggerConfig);

class App {
  constructor() {
    this.app = express();

    this.app
        .use( cors() );

    this.app
        .use( bodyParser.json() );

    this.app.use( '/api-docs',
                  swaggerUi.serve,
                  swaggerUi.setup(swaggerDoc) );

    this.signUpService = new SignUpService();
    this.signInService = new SignInService();
    this.forgotPassword = new ForgotPassword();
    this.infoService = new InfoService();
    this.profileService = new ProfileService();
  }

  async syncDB() {
    if (! constants.isDevelopment) {
        await runMigrations();
    }

    // "sync()" creates the database table for our model(s),
    // if we make .sync({force: true}),
    // the db is dropped first if it is already existed
    await database.sync( {
        force: constants.RESET_DATABASE
    } );

    this.app
        .listen(constants.nodePort, () => {
      console.log(`Listening on port ${constants.nodePort}`);
    } );
  }

  defineLogLevel() {
      Logger.setLevel(constants.LOG_LEVEL);
  }

  defineEvents() {
    this.signUpService
        .defineEvents(this.app);

    this.signInService
        .defineEvents(this.app);

    this.forgotPassword
        .defineEvents(this.app);

    this.infoService
        .defineEvents(this.app);

    this.profileService
        .defineEvents(this.app);
  }
}

const main = new App();

main.syncDB()
    .then( () => {
      main.defineLogLevel();
      main.defineEvents();
      } )
    .catch( (error) => {
      console.log(error);
    }) ;
