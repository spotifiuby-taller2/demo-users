const assert = require('assert');
const sinon = require('sinon');
const rewire = require("rewire");
const SignUpService = rewire("../src/services/SignUpService");
const setErrorResponse = require('../src/others/utils').setErrorResponse;

const signUpService = new SignUpService();

describe('SignUpService', function() {
  describe('handleSignUp', function () {
    it("creates a non activated admin and sends confirmation email", async function() {
      const createNonActivatedUserMock = sinon.fake.returns(Promise.resolve(null));
      const sendConfirmationEmailMock = sinon.fake.returns(Promise.resolve(null));
      const setBodyResponseMock = sinon.fake();
      const setErrorResponseMock = sinon.fake();

      const revertRewire = SignUpService.__set__({
        Users: {findOne: () => Promise.resolve(null)},
        NonActivatedUsers: {findOne: () => Promise.resolve(null), create: createNonActivatedUserMock},
        utils: {getId: () => 1, getBcryptOf: () => '', setBodyResponse: setBodyResponseMock, setErrorResponse: setErrorResponseMock },
        sendConfirmationEmail: sendConfirmationEmailMock,
      });

      const req = {
        body: {
          email: 'email@email.com',
          password: 'long password',
          repeatPassword: 'long password',
          isExternal: false,
          phoneNumber: '1234',
          username: 'username',
          isArtist: true,
          isListener: true,
          isBand: false,
          link: 'web',
        }
      };

      const res = {};

      await signUpService.handleSignUp(req, res);

      assert(createNonActivatedUserMock.calledOnce);
      assert(sendConfirmationEmailMock.calledOnce);
      assert(setBodyResponseMock.calledWith({result: "Correo enviado", id: 1}, 200, res));
      revertRewire();
    });

    it("creates a non activated user and sends pin using whatsApp", async function() {
      const createNonActivatedUserMock = sinon.fake.returns(Promise.resolve(null));
      const sendWhatsAppVerificationCodeMock = sinon.fake.returns(Promise.resolve());
      const setBodyResponseMock = sinon.fake();
      const setErrorResponseMock = sinon.fake();

      const revertRewire = SignUpService.__set__({
        Users: {findOne: () => Promise.resolve(null)},
        NonActivatedUsers: {findOne: () => Promise.resolve(null), create: createNonActivatedUserMock},
        utils: {getId: () => 1, getBcryptOf: () => '', setBodyResponse: setBodyResponseMock, setErrorResponse: setErrorResponseMock },
        WhatsAppService: { sendVerificationCode: sendWhatsAppVerificationCodeMock},
      });

      const req = {
        body: {
          email: 'email@email.com',
          password: 'long password',
          repeatPassword: 'long password',
          isExternal: false,
          phoneNumber: '1234',
          username: 'username',
          isArtist: true,
          isListener: true,
          isBand: false,
        }
      };

      const res = {};

      await signUpService.handleSignUp(req, res);

      assert(createNonActivatedUserMock.calledOnce);
      assert(sendWhatsAppVerificationCodeMock.calledOnce);
      assert(setBodyResponseMock.calledWith({result: "Pin enviado", id: 1}, 200, res));
      revertRewire();
    });

  describe('createVerifiedUser', function() {
    it("verifies an inactive user", async function() {
        const user = {
          email: 'email@email.com',
          password: 'long password',
          isExternal: false,
        };
        const findNonActivatedUserMock = sinon.fake.returns(Promise.resolve(user));
        const firebaseUser = {
          accessToken: 'user token',
          uid: 1
        };
        const createUserMock = sinon.fake.returns(Promise.resolve(firebaseUser));
        const createUserInDbMock = sinon.fake.returns(Promise.resolve());
        const setBodyResponseMock = sinon.fake();
        const postToGatewayMock = sinon.fake.returns(Promise.resolve({id: 1}));
        const destroyNonActivatedUserMock = sinon.fake.returns(Promise.resolve());
        const revertRewire = SignUpService.__set__({
          NonActivatedUsers: {findOne: findNonActivatedUserMock, destroy: destroyNonActivatedUserMock},
          auth: {createUser: createUserMock},
          Users: {create: createUserInDbMock},
          utils: {setBodyResponse: setBodyResponseMock, postToGateway: postToGatewayMock},
        });
        const req = {
          params: {
            userId: 1,
          },
        };
        const jsonMock = {json: sinon.fake()};
        const res = {status: sinon.fake.returns(jsonMock)};

        await signUpService.createVerifiedUser(req, res);

        assert(findNonActivatedUserMock.calledOnce);
        assert(createUserMock.calledWith(sinon.match.has('email', user.email)
          .and(sinon.match.has('emailVerified', true))
          .and(sinon.match.has('password', user.password))
          .and(sinon.match.has('disabled', false))));
        assert(createUserInDbMock.calledOnce);
        assert(destroyNonActivatedUserMock.calledOnce);
        assert(postToGatewayMock.calledOnce);
        assert(res.status.calledWith(200));
        assert(jsonMock.json.calledWith({
          status: "ok",
          id: 1
        }));
        revertRewire();
      });

    it("Gateway error", async function() {
        const user = {
          email: 'email@email.com',
          password: 'long password',
          isExternal: false,
        };
        const findNonActivatedUserMock = sinon.fake.returns(Promise.resolve(user));
        const firebaseUser = {
          accessToken: 'user token',
          uid: 1
        };
        const createUserMock = sinon.fake.returns(Promise.resolve(firebaseUser));
        const createUserInDbMock = sinon.fake.returns(Promise.resolve());
        const postToGatewayMock = sinon.fake.returns(Promise.resolve({error: "gateway error"}));
        const destroyNonActivatedUserMock = sinon.fake.returns(Promise.resolve());
        const revertRewire = SignUpService.__set__({
          NonActivatedUsers: {findOne: findNonActivatedUserMock, destroy: destroyNonActivatedUserMock},
          auth: {createUser: createUserMock},
          Users: {create: createUserInDbMock},
          utils: {
            setErrorResponse: setErrorResponse,
            postToGateway: postToGatewayMock},
        });
        const req = {
          params: {
            userId: 1,
          },
        };
        const jsonMock = {json: sinon.fake()};
        const res = {status: sinon.fake.returns(jsonMock)};

        await signUpService.createVerifiedUser(req, res);

        assert(findNonActivatedUserMock.calledOnce);
        assert(res.status.calledWith(500));
        assert(jsonMock.json.calledWith({
          error: "gateway error"
        }));
        revertRewire();
      });

    it("Create verified user error", async function() {
        const user = {
          email: 'email@email.com',
          password: 'long password',
          isExternal: false,
        };
        const findNonActivatedUserMock = sinon.fake.returns(Promise.resolve(user));

        const createUserMock = sinon.fake.returns(Promise.resolve({error: "User creation error"}));
        const createUserInDbMock = sinon.fake.returns(Promise.resolve());
        const postToGatewayMock = sinon.fake.returns(Promise.resolve({id: 1}));
        const destroyNonActivatedUserMock = sinon.fake.returns(Promise.resolve());
        const revertRewire = SignUpService.__set__({
          NonActivatedUsers: {findOne: findNonActivatedUserMock, destroy: destroyNonActivatedUserMock},
          auth: {createUser: createUserMock},
          Users: {create: createUserInDbMock},
          utils: {
            setErrorResponse: setErrorResponse,
            postToGateway: postToGatewayMock},
        });
        const req = {
          params: {
            userId: 1,
          },
        };
        const jsonMock = {json: sinon.fake()};
        const res = {status: sinon.fake.returns(jsonMock)};

        await signUpService.createVerifiedUser(req, res);

        assert(res.status.calledWith(561));
        assert(jsonMock.json.calledWith({
          error: "User creation error"
        }));
        revertRewire();
      });

    it("Invalid pin error", async function() {
        const user = {
          email: 'email@email.com',
          password: 'long password',
          isExternal: false,
        };
        const findNonActivatedUserMock = sinon.fake.returns(null);

        const createUserMock = sinon.fake.returns(Promise.resolve({error: "User creation error"}));
        const createUserInDbMock = sinon.fake.returns(Promise.resolve());
        const postToGatewayMock = sinon.fake.returns(Promise.resolve({error: "gateway error"}));
        const destroyNonActivatedUserMock = sinon.fake.returns(Promise.resolve());
        const revertRewire = SignUpService.__set__({
          NonActivatedUsers: {findOne: findNonActivatedUserMock, destroy: destroyNonActivatedUserMock},
          auth: {createUser: createUserMock},
          Users: {create: createUserInDbMock},
          utils: {
            setErrorResponse: setErrorResponse,
            postToGateway: postToGatewayMock},
        });
        const req = {
          params: {
            userId: 1,
          },
        };
        const jsonMock = {json: sinon.fake()};
        const res = {status: sinon.fake.returns(jsonMock)};

        await signUpService.createVerifiedUser(req, res);

        assert(res.status.calledWith(461));
        assert(jsonMock.json.calledWith({
          error: "PIN de confirmación inválido"
        }));
        revertRewire();
      });
    });
  });
});

