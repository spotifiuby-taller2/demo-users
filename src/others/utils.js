const bcrypt = require("bcrypt");
const crypto = require("crypto");
const constants = require("../others/constants");
const fetch = require("node-fetch");

function setBodyResponse(responseBody, status, res) {
  res.status(status).json(responseBody);
}

function setErrorResponse(error, status, res) {
  const responseBody = {
    error: error.toString(),
  };

  setBodyResponse(responseBody, status, res);
}

function getDate() {
  return new Date().toISOString().substr(0, 10);
}

function replaceAll(str, toReplace, newStr) {
  return str.split(toReplace).join(newStr);
}

// Sync = blocks the event loop
function getBcryptOf(toHash) {
  return bcrypt.hashSync(toHash, constants.BASE_SALT);
}

function getHashOf(toHash) {
  // Edge case: slashes cannot be used in URLs items.
  return replaceAll(getBcryptOf(toHash), "/", "a");
}

function getId() {
  const base = crypto.randomBytes(20).toString("hex");

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
  return (
    list.filter((element) => element === undefined || element.length === 0)
      .length > 0
  );
}

function invalidFieldFormat(email, password) {
  if (password.length < constants.MIN_PASS_LEN) {
    return true;
  }

  if (!/^\w+([+.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }

  return false;
}

const postToGateway = (body) => {
  body.apiKey = constants.MY_API_KEY;

  return fetch(constants.SERVICES_HOST + constants.CHECK_URL, {
        method: "POST",
        headers: constants.JSON_HEADER,
        body: JSON.stringify(body)
      }
  ).then(async r => {
    const gatewayResponse = await r.json();

    if (gatewayResponse.error !== undefined) {
      return gatewayResponse;
    }

    return await fetch(body.redirectTo, {
      method: "POST",
      headers: constants.JSON_HEADER,
      body: JSON.stringify(body)
    } )
        .then(async response => {
          return await response.json();
        }).catch(err => {
          return {
            error: err.toString()
          }
        } );
  } ).catch(error => {
    return {
      error: error.toString()
    };
  } );
}

const getToGateway = (destiny,
                      redirectParams) => {
  const body = {}
  body.apiKey = constants.MY_API_KEY;

  const redirectParamsAux = redirectParams !== undefined ? redirectParams
      : "";
  const redirectTo = destiny + redirectParamsAux;
  body.redirectTo = redirectTo;

  return fetch(constants.SERVICES_HOST + constants.CHECK_URL, {
        method: "POST",
        headers: constants.JSON_HEADER,
        body: JSON.stringify(body)
      }
  ).then(async r => {
    const gatewayResponse = await r.json();

    if (gatewayResponse.error !== undefined) {
      return gatewayResponse;
    }

    return await fetch(redirectTo, {
      method: "GET",
      headers: constants.JSON_HEADER
    } )
        .then(async response => {
          return await response.json();
        }).catch(err => {
          return {
            error: err.toString()
          }
        } );
  } ).catch(error => {
    return {
      error: error.toString()
    };
  } );
}

const notMonthIntervalYet = (day) => {
  const payDate = day.setMonth(day.getMonth() + 1);

  return Date.now() < payDate;
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
  invalidFieldFormat,
  postToGateway,
  getToGateway, notMonthIntervalYet
};
