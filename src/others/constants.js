require('dotenv').config( {
  path: `.env.${process.env
                       .NODE_ENV}`
} );

/* Frontend hosts */
const BACKOFFICE_HOST = process.env
                               .BACKOFFICE_HOST;

/* Frontend paths */
const HOME_URL = "/home";

/* Backends paths */
const SIGN_UP_URL = "/signup";
const SIGN_IN_URL = "/signin";

const JSON_HEADER = {
  'Content-Type': 'application/json'
}

/* Parsed from docker-compose.yml */
const NODE_DOCKER_PORT = process.env
                                .NODE_DOCKER_PORT;

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDlFbw1n3eqg7ogdwGuiTetV6isK4Uhqno",
  authDomain: "fir-firebase-acc6b.firebaseapp.com",
  projectId: "fir-firebase-acc6b",
  storageBucket: "fir-firebase-acc6b.appspot.com",
  messagingSenderId: "296878360901",
  appId: "1:296878360901:web:7987ce42ec0a406b1f162c"
};

const DATABASE_URL = `${process.env.DB}://${process.env.POSTGRES_USER}`
                      .concat(`:${process.env.POSTGRES_PASSWORD}@${process.env.DB_CONTAINER_NAME}`)
                      .concat(`:${process.env.DB_PORT}/${process.env.POSTGRES_DB}`);

module.exports = {
  FIREBASE_CONFIG,
  BACKOFFICE_HOST,
  HOME_URL,
  SIGN_UP_URL,
  SIGN_IN_URL,
  JSON_HEADER,
  NODE_DOCKER_PORT,
  DATABASE_URL
};
