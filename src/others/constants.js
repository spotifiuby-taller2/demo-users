require('dotenv').config({
    path: `.env${process.env
        .MY_ENV}`
});

const MAX_STR_LEN = 254;
const FIREBASE_MAX_LEN = 36;
const BCRYPT_LEN = 60;
const SHA_LEN = 64;
const PHONE_NUMBER_LEN = 15;

const MIN_STR_LEN = 2;
const MIN_PASS_LEN = 10;
const DATE_FORMAT = "YYYY-M-D H:mm:ss.SS";
const TIMEZONE = "America/Buenos_Aires";
const SYMBOL_MAX_LEN = 10;
const TIMESTAMP_MAX_LEN = 30;
const NAME_MAX_LEN = 30;
const LISTENER='listener';
const ARTIST='artist';

const JSON_HEADER = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

const LOG_LEVEL = process.env
                         .LOG_LEVEL;

const BASE_SALT = '$2b$10$sfW8rHWvJcda/4cMOq.p5.';

const RESET_DATABASE = false;

/* Frontend hosts */
const FRONT_HOST = process.env
                          .FRONT_HOST;

/* Frontend paths */
const HOME_URL = "/home";


/* Backends paths */
const SIGN_UP_URL = "/signup";
const SIGN_IN_URL = "/signin";
const SIGN_UP_END_URL = SIGN_UP_URL + "/end";
const FORGOT_PASSWORD_URL = "/forgotpassword";
const RESTAURANTS_URL = "/restaurants";
const RESTAURANTS_LIST_URL = RESTAURANTS_URL + "/list";
const RESTAURANTS_NEW_URL = RESTAURANTS_URL + "/new";

/* ====== Docker vs Development config ====== */
let nodePort;

let databaseUrl =`postgres`.concat(`://postgres`)
                            .concat(`:postgres`)
                            .concat(`@localhost`)
                            .concat(`:5432`)
                            .concat(`/pediya_db`);

if (process.env
           .PORT === undefined) {
    nodePort = process.env
                      .NODE_DOCKER_PORT;
} else {
    // Heroku
    nodePort = process.env
        .PORT;
}

/* ====== Production vs Development config ====== */
const isDevelopment = process.env
                             .PRODUCTION === undefined;

const DB_DIALECT = "postgres";

const ONE_HOUR_DIFFERENCE = 3600000;

const SENDGRID_API_KEY = "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";

module.exports = {
    DB_DIALECT,
    SHA_LEN,
    SIGN_UP_URL,
    HOME_URL,
    SIGN_IN_URL,
    SIGN_UP_END_URL,
    JSON_HEADER,
    nodePort,
    databaseUrl,
    FRONT_HOST,
    MAX_STR_LEN,
    FIREBASE_MAX_LEN,
    BCRYPT_LEN,
    PHONE_NUMBER_LEN,
    MIN_STR_LEN,
    MIN_PASS_LEN,
    DATE_FORMAT,
    TIMEZONE,
    SYMBOL_MAX_LEN,
    TIMESTAMP_MAX_LEN,
    RESET_DATABASE,
    isDevelopment,
    LOG_LEVEL,
    FORGOT_PASSWORD_URL,
    ONE_HOUR_DIFFERENCE,
    NAME_MAX_LEN,
    LISTENER,
    ARTIST,
    RESTAURANTS_LIST_URL,
    RESTAURANTS_NEW_URL,
    BASE_SALT,
    SENDGRID_API_KEY
}
