const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { BASE_SALT, MIN_PASS_LEN } = require("../others/constants");

function setBodyResponse(responseBody,
                         status,
                         res) {
  res.status(status)
     .json(responseBody);
}

function setErrorResponse(error,
                          status,
                          res) {
  const responseBody = {
    error: error.toString()
  }

  setBodyResponse(responseBody, status, res);
}

function getDate() {
  return new Date().toISOString()
                   .substr(0, 10);
}

function replaceAll(str,
                    toReplace,
                    newStr) {
  return str.split(toReplace)
            .join(newStr)
}

// Sync = blocks the event loop
function getBcryptOf(toHash) {
  return bcrypt.hashSync(toHash, BASE_SALT);
}

function getHashOf(toHash) {
  // Edge case: slashes cannot be used in URLs items.
  return replaceAll( getBcryptOf(toHash),
                     "/",
                     "a" );
}

function getId() {
  const base = crypto.randomBytes(20)
                     .toString('hex');

  return getHashOf(base);
}

// Credits:
// https://stackoverflow.com/questions/4816099/
// chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
/*function antiRecursiveStringify (object){
  let simpleObject = {};

  for (let prop in object ){
    if ( ! object.hasOwnProperty(prop)
        || (typeof(object[prop]) == 'object')
        || (typeof(object[prop]) == 'function') ) {
      continue;
    }
    simpleObject[prop] = object[prop];
  }

  // returns cleaned up JSON
  return JSON.stringify(simpleObject);
} */

function areAnyUndefined(list) {
  return list.filter( (element) => {
    return element === undefined
           || element.length === 0
  } ).length > 0;
}

function invalidFieldFormat(body, isAdmin){
  const { email,
    password,
    repeatPassword,
    isArtist,
    isListener} = body;

    if (password.length < MIN_PASS_LEN ) {
      return true;
    }
    /*
    else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password)){
      return true;
    }*/
    
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      return true;
    }

    if (password !== repeatPassword){
      return true;
    }

    return !isArtist && !isListener && !isAdmin;
}

module.exports = {
  getId,
  getBcryptOf,
  setErrorResponse,
  setBodyResponse,
  replaceAll,
  getHashOf,
  getDate,
  areAnyUndefined,
  invalidFieldFormat
}
