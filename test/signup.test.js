const Users = require("../src/data/Users");
const NonActivatedUsers = require("../src/data/NonActivatedUsers");
const constants = require('../src/others/constants');
const LoggerMock = require('./mocks/LoggerMock');
const FirebaseMock = require('./mocks/FirebaseMock');

const app = require('./mocks/MockServer');
const chai = require('chai')
const chai_http = require('chai-http');
chai.use(chai_http);
const assert = require('assert');

const rewire = require("rewire");
const SignUpService = rewire("../src/services/SignUpService");

/* If running on an IDE, remember to use the environment variables
*  detailes in package.json. For example:
*  MY_ENV=.test; LOG_LEVEL=debug */

// Mock email
SignUpService.__set__("sendConfirmationEmail",
                      () => '' );
// Mock logger
SignUpService.__set__("Logger",
                      LoggerMock);

// Mock firebase
SignUpService.__set__("firebaseAuth",
                      FirebaseMock);

const server = app.listen(3000, () => {});

// Define endpoints for the mocked server
new SignUpService().defineEvents(app);

describe('SignUpService tests : ', () => {
    it("post /signup", (done) => {
        // Mock database
        if ( constants.databaseUrl
            .includes("sqlite") ) {
            Users.truncate()
                .then();

            NonActivatedUsers.truncate()
                .then();
        }

        const requestBody = {
            email: "cuentadetaller2@gmail.com",
            password: "lkdfj983jfmerljkf3qomdsfasd",
            link: "web"
        };

        chai.request(app)
            .post(constants.SIGN_UP_URL)
            .set('content-type', 'application/json')
            .send(requestBody)
            .end((err, res) => {
                    assert.strictEqual(res.body
                                          .result,
                                     'Correo enviado');
                    done();
                });
    } );
/*
    it("get " + constants.SIGN_UP_END_URL + '/111', (done) => {
        const anId = 111;

        // Mock database
        if ( constants.databaseUrl
            .includes("sqlite") ) {
            Users.truncate()
                 .then();

            NonActivatedUsers.truncate()
                             .then();

            NonActivatedUsers.create( {
                id: anId,
                email: "email@email.com",
                password: "fjdkladlfad",
                isAdmin: true,
            } ).then();
        }

        chai.request(app)
            .get(constants.SIGN_UP_END_URL + '/111')
            .set('content-type', 'application/json')
            .end((err, res) => {
                 assert.strictEqual(res.body
                                       .result,
                     'Correo enviado');
                 done();
             });
    } );
    */

} );

after(async () => {
    server.close();
});
