require('dotenv').config( {
  path: `.env${process.env
                      .MY_ENV}`
} );

const MAX_STR_LEN = 254;
const FIREBASE_MAX_LEN = 36;
const BCRYPT_LEN = 60;
const SHA_LEN = 64;

const MIN_STR_LEN = 2;
const MIN_PASS_LEN = 8;
const DATE_FORMAT = "YYYY M D H:mm:ss";
const TIMEZONE = "America/Buenos_Aires";
const SYMBOL_MAX_LEN = 10;
const TIMESTAMP_MAX_LEN = 30;

/* Frontend hosts */
const BACKOFFICE_HOST = process.env
                               .BACKOFFICE_HOST;

const USERS_HOST = process.env
                          .USERS_HOST;

/* Frontend paths */
const HOME_URL = "/home";

/* Backends paths */
const SIGN_UP_URL = "/signup";
const SIGN_IN_URL = "/signin";
const SIGN_UP_END_URL = SIGN_UP_URL + "/end";

const JSON_HEADER = {
  'Content-Type': 'application/json'
}

/* Parsed from docker-compose.yml */
const NODE_DOCKER_PORT = process.env
                                .NODE_DOCKER_PORT;

const RESET_DATABASE = false;

let databaseUrl;

if (process.env.DATABASE_URL === undefined) {
  databaseUrl = `${process.env.DB}`
      .concat(`://${process.env.POSTGRES_USER}`)
      .concat(`:${process.env.POSTGRES_PASSWORD}`)
      .concat(`@${process.env.DB_CONTAINER_NAME}`)
      .concat(`:${process.env.DB_PORT}`)
      .concat(`/${process.env.POSTGRES_DB}`);
} else {
  databaseUrl = process.env.DATABASE_URL;
}

const SENDGRID_API_KEY = "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";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDlFbw1n3eqg7ogdwGuiTetV6isK4Uhqno",
  authDomain: "fir-firebase-acc6b.firebaseapp.com",
  projectId: "fir-firebase-acc6b",
  storageBucket: "fir-firebase-acc6b.appspot.com",
  messagingSenderId: "296878360901",
  appId: "1:296878360901:web:7987ce42ec0a406b1f162c"
};

module.exports = {
  SHA_LEN,
  SIGN_UP_URL,
  USERS_HOST,
  HOME_URL,
  SIGN_IN_URL,
  SIGN_UP_END_URL,
  JSON_HEADER,
  NODE_DOCKER_PORT,
  FIREBASE_CONFIG,
  databaseUrl,
  BACKOFFICE_HOST,
  MAX_STR_LEN,
  FIREBASE_MAX_LEN,
  BCRYPT_LEN,
  MIN_STR_LEN,
  MIN_PASS_LEN,
  DATE_FORMAT,
  TIMEZONE,
  SYMBOL_MAX_LEN,
  TIMESTAMP_MAX_LEN,
  SENDGRID_API_KEY,
  RESET_DATABASE
}