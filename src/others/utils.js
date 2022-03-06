const constants = require("../others/constants");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

function setBodyResponse(res,
                         status,
                         res_body) {
  // console.log(`Response status: ${status}\n` +
  //  `\tResponse body: ${JSON.stringify(res_body)}`);
  res.status(status)
     .json(res_body);
}

function setErrorResponse(error, res) {
  const responseBody = {
    error: error.toString()
  }

  res.status(400)
      .json(responseBody);
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

module.exports = {
  getId,
  getBcryptOf,
  setErrorResponse,
  setBodyResponse,
  replaceAll
}