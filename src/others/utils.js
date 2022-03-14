const bcrypt = require("bcrypt");
const crypto = require('crypto');

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

function getBcryptOf(toHash) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(toHash, salt);
}

// Sync = blocks the event loop
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

module.exports = {
  getId,
  getBcryptOf,
  setErrorResponse,
  setBodyResponse,
  replaceAll,
  getHashOf,
  getDate
}