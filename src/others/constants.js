require('dotenv').config({
    path: `.env${process.env
        .MY_ENV}`
});

const MAX_STR_LEN = 254;
const FIREBASE_MAX_LEN = 36;
const BCRYPT_LEN = 60;
const SHA_LEN = 64;
const PIN_LEN = 8;
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

const RESET_DATABASE = false;

/* Frontend hosts */
const BACKOFFICE_HOST = process.env
    .BACKOFFICE_HOST;

const AUTH_FRONT = process.env
    .AUTH_FRONT;

const USERS_HOST = process.env
    .USERS_HOST;

const PAYMENT_HOST = process.env
    .PAYMENT_HOST;

const SERVICES_HOST = process.env
    .SERVICES_HOST;

/* Frontend paths */
const HOME_URL = "/home";


/* Backends paths */
const USERS_URL = "/users";
const USERS_LIST_URL = USERS_URL + "/list";
const APP_USERS_LIST_URL = USERS_URL + "/applist";
const APP_ARTIST_LIST_URL = USERS_URL + "/artistlist";
const APP_FAV_ARTIST_LIST_URL = USERS_URL + "/favartistlist";
const APP_FAV_ARTIST_URL = USERS_URL + "/favartist";
const USERS_BLOCK_URL = USERS_URL + "/block";
const USERS_UNLOCK_URL = USERS_URL + "/unlock";
const USERS_CREATE_ADMIN_URL = USERS_URL + "/createadmin";
const USERS_VERIFIED_URL = USERS_URL + "/verified";
const USERS_UNVERIFIED_URL = USERS_URL + "/unverified";
const PROFILE_URL = USERS_URL + "/profile";
const PROFILE_PHOTO_URL = PROFILE_URL + "/photo";
const PROFILE_VERIFICATION_VIDEO_URL = PROFILE_URL + "/verification/video";
const MUSICAL_PREF_URL = PROFILE_URL + "/musicalpref";
const SIGN_UP_URL = "/signup";
const SIGN_IN_URL = "/signin";
const SIGN_UP_END_URL = SIGN_UP_URL + "/end";
const FORGOT_PASSWORD_URL = "/forgotpassword";
const LISTENER_LOC_URL = "/listener/location";
const WALLET_URL = "/wallet";

const PROFILE_USER_BASIC_INFO_URL= PROFILE_URL + "/basicinfo";
const EDIT_PROFILE_URL = USERS_URL + "/editprofile";
const PUSH_NOTIFICATION_TOKEN_URL = PROFILE_URL + "/pushnotificationtoken";
const NOTIFICATION_LIST_URL = USERS_URL + "/notificationlist"
const PROFILE_USER_TYPE_URL= PROFILE_URL + "/type";
const PARSE_USERS_URL= "/parse";
const CHECK_URL="/check";
const BAND_URL= USERS_URL + "/band";
const DEPOSIT_URL = "/deposit";
const USER_WITH_WALLET_URL = "/userwithwallet";

/* ====== Docker vs Development config ====== */
let nodePort;

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
let databaseUrl;

const DB_DIALECT = "postgres";
let DB_USER;
let DB_PASSWORD;
let DB_HOST;
let DB_PORT;
let POSTGRES_DB;

if (isDevelopment) {

    if (process.env.DATABASE_URL === undefined) {
        DB_USER = process.env.POSTGRES_USER;
        DB_PASSWORD = process.env.POSTGRES_PASSWORD;
        DB_HOST = process.env.DB_CONTAINER_NAME;
        DB_PORT = process.env.DB_PORT;
        POSTGRES_DB = process.env.POSTGRES_DB;

        databaseUrl = `${process.env.DB}`
            .concat(`://${DB_USER}`)
            .concat(`:${DB_PASSWORD}`)
            .concat(`@${DB_HOST}`)
            .concat(`:${DB_PORT}`)
            .concat(`/${POSTGRES_DB}`);
    } else {
        databaseUrl = process.env.DATABASE_URL;
    }
} else {
    // Heroku
    // DATABASE_URL=${DB}://${POSTGRES_USER}:${POSTGRES_PASSWORD}
    //              @${DB_CONTAINER_NAME}:${DB_PORT}/${POSTGRES_DB}
    databaseUrl = process.env.DATABASE_URL;

    // ONLY use it on migrations (they may change)
    DB_USER = databaseUrl.split("@")[0]
        .split("://")[0]
        .split(":")[0];

    DB_PASSWORD = databaseUrl.split("@")[0]
        .split("://")[0]
        .split(":")[1];

    DB_HOST = databaseUrl.split("@")[1]
        .split(":")[0];

    DB_PORT = databaseUrl.split("@")[1]
        .split(":")[1]
        .split("/")[0];

    POSTGRES_DB = databaseUrl.split("@")[1]
        .split(":")[1]
        .split("/")[1];

}

const firebaseJson = require("./firebase_production.json");

const SENDGRID_API_KEY = "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";
const MY_API_KEY = "72b60f6945b9beccf2a92c7da5f5c1963f4ec68240a1814b4ec5273cac5e7a44";

const BASE_SALT = '$2b$10$sfW8rHWvJcda/4cMOq.p5.';

const ONE_HOUR_DIFFERENCE = 3600000;

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const MAX_LIMIT = 1000000;
const PREMIUN_COST = '0.000000000001';

const NOT_ENOUGHT_MONEY_PAYMENT_ERROR = 'insufficient funds for intrinsic transaction cost';

module.exports = {
    DB_USER, DB_PASSWORD, DB_HOST, DB_PORT,
    POSTGRES_DB, DB_DIALECT, SHA_LEN, SIGN_UP_URL, USERS_HOST,
    HOME_URL, SIGN_IN_URL, SIGN_UP_END_URL, JSON_HEADER,
    nodePort,
    databaseUrl,
    BACKOFFICE_HOST,
    MAX_STR_LEN,
    FIREBASE_MAX_LEN,
    BCRYPT_LEN,
    PIN_LEN,
    PHONE_NUMBER_LEN,
    MIN_STR_LEN,
    MIN_PASS_LEN,
    DATE_FORMAT,
    TIMEZONE,
    SYMBOL_MAX_LEN,
    TIMESTAMP_MAX_LEN,
    SENDGRID_API_KEY,
    RESET_DATABASE,
    isDevelopment,
    LOG_LEVEL,
    BASE_SALT,
    AUTH_FRONT,
    FORGOT_PASSWORD_URL,
    firebaseJson,
    ONE_HOUR_DIFFERENCE,
    USERS_LIST_URL,
    USERS_BLOCK_URL,
    USERS_UNLOCK_URL,
    NAME_MAX_LEN,
    LISTENER_LOC_URL,
    PROFILE_URL,
    PAYMENT_HOST,
    SERVICES_HOST,
    WALLET_URL,
    MY_API_KEY,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    APP_USERS_LIST_URL,
    MUSICAL_PREF_URL,
    APP_ARTIST_LIST_URL,
    PROFILE_PHOTO_URL,
    APP_FAV_ARTIST_LIST_URL,
    APP_FAV_ARTIST_URL,
    LISTENER,
    ARTIST,
    PROFILE_USER_BASIC_INFO_URL,
    EDIT_PROFILE_URL,
    PUSH_NOTIFICATION_TOKEN_URL,
    NOTIFICATION_LIST_URL,
    PROFILE_VERIFICATION_VIDEO_URL,
    PROFILE_USER_TYPE_URL,
    PARSE_USERS_URL,
    USERS_CREATE_ADMIN_URL,
    USERS_VERIFIED_URL,
    USERS_UNVERIFIED_URL, MAX_LIMIT, CHECK_URL, BAND_URL,
    PREMIUN_COST, DEPOSIT_URL, NOT_ENOUGHT_MONEY_PAYMENT_ERROR,
    USER_WITH_WALLET_URL
}
