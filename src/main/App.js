const database = require('../data/database');
const SignUpService = require('../services/SignUpService');
const SignInService = require('../services/SignInService');
const constants = require('../others/constants');
const cors = require('cors');
const express = require('express');
const bodyParser = require("body-parser");
const Logger = require("../services/Logger");
const { runMigrations } = require("../data/migrations");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const ForgotPassword = require("../services/ForgotPassword");
const {RestaurantService} = require("../services/RestaurantService");
const { swaggerConfig } = require('./swaggerConfig');

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

    this.restaurantsService = new RestaurantService();
  }

  async syncDB() {
    // Delete this constant after first run
    // const firstTimeToRun = true;

    // "sync()" creates the database table for our model(s),
    // if we make .sync({force: true}),
    // the db is dropped first if it is already existed.
    await database.sync( {
        // force: constants.RESET_DATABASE || firstTimeToRun
        force: constants.RESET_DATABASE
    } );

      // if (! constants.isDevelopment || firstTimeToRun) {
      if (! constants.isDevelopment) {
          await runMigrations();
      }

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

    this.restaurantsService
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
    } ) ;
