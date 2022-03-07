const database = require('../data/database');
const { SignUpService } = require('../services/SignUpService');
const constants = require('../others/constants');
const cors = require('cors');
const express = require('express');
const bodyParser = require("body-parser");

class App {
  constructor() {
    this.app = express();

    this.app
        .use( cors() );

    this.app
        .use( bodyParser.json() );

    this.signUpService = new SignUpService();
  }

  async syncDB() {
    // "sync()" creates the database table for our model(s),
    // if we make .sync({force: true}),
    // the db is dropped it first if it already existed
    await database.sync( {
        force: constants.RESET_DATABASE
    } );

    this.app
        .listen(constants.NODE_DOCKER_PORT, () => {
      console.log(`Listening on port ${constants.NODE_DOCKER_PORT}`)
    } );
  }

  defineEvents() {
    this.signUpService
        .defineEvents(this.app);
  }
}

const main = new App();

main.syncDB()
    .then( () => {
      main.defineEvents();
      } )
    .catch( (error) => {
      console.log(error);
    }) ;
