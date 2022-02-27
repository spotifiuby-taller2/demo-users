import cors from 'cors';
import express from 'express';
import bodyParser from "body-parser";
import { database } from '../database/database';
import { SignUpService } from '../services/SignUpService'
import * as Constants from "../others/constants"

class App {
  constructor() {
    this.app = express();
    this.app.use( cors() );
    this.app.use(bodyParser.json());
    this.service = new SignUpService();
  }

  async syncDB() {
    // "sync()" creates the database table for our model(s),
    // if we make .sync({force: true}),
    // the db is dropped it first if it already existed
    await database.sync( {force: false} );

    this.app.listen(process.env
                           .NODE_DOCKER_PORT, () => {
      console.log(`Listening on port ${process.env
                                              .NODE_DOCKER_PORT}`)
    } );
  }

  defineEvents() {
    this.app.get(Constants.signUpUrl, this.service
                                          .handleSignUp()
                                          .bind(this));
  }
}

const main = new App();

main.syncDB().then( () => {
  main.defineEvents();
} );
