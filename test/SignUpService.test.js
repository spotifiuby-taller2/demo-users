const assert = require('assert');
const sinon = require('sinon');
const rewire = require("rewire");
const SignUpService = rewire("../src/services/SignUpService");

const signUpService = new SignUpService();

describe('SignUpService', function() {
  describe('handleSignUp', function () {
    it("creates a non activated user and sends confirmation email", async function() {
      const createNonActivatedUserMock = sinon.fake.returns(Promise.resolve(null));
      const sendConfirmationEmailMock = sinon.fake.returns(Promise.resolve(null));
      const setBodyResponseMock = sinon.fake();
      const revertRewire = SignUpService.__set__({
        Users: {findOne: () => Promise.resolve(null)},
        NonActivatedUsers: {findOne: () => Promise.resolve(null), create: createNonActivatedUserMock},
        utils: {getId: () => 1, getBcryptOf: () => '', setBodyResponse: setBodyResponseMock},
        MailService: {sendConfirmationEmail: sendConfirmationEmailMock},
      });
      const req = {
        body: {
          email: 'email@email.com',
          password: 'long password',
          link: 'web',
          isExternal: false,
        }
      };
      const res = {};

      await signUpService.handleSignUp(req, res);

      assert(createNonActivatedUserMock.calledOnce);
      assert(sendConfirmationEmailMock.calledOnce);
      assert(setBodyResponseMock.calledWith({result: "Correo enviado a tu cuenta."}, 201, res));
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
        const firebaseUser = {user: {accessToken: 'user token'}};
        const createUserWithEmailAndPasswordMock = sinon.fake.returns(Promise.resolve(firebaseUser));
        const createUserInDbMock = sinon.fake.returns(Promise.resolve());
        const setBodyResponseMock = sinon.fake();
        const destroyNonActivatedUserMock = sinon.fake.returns(Promise.resolve());
        const revertRewire = SignUpService.__set__({
          NonActivatedUsers: {findOne: findNonActivatedUserMock, destroy: destroyNonActivatedUserMock},
          firebaseAuth: {createUserWithEmailAndPassword: createUserWithEmailAndPasswordMock},
          Users: {create: createUserInDbMock},
          utils: {setBodyResponse: setBodyResponseMock},
        });
        const req = {
          params: {
            userId: 1,
          },
        };
        const jsonMock = {json: sinon.fake()};
        const res = {status: sinon.fake.returns(jsonMock)};

        await signUpService.createVerifiedUser(req, res);

        assert(findNonActivatedUserMock.calledWith({where: {id: 1}}));
        assert(createUserWithEmailAndPasswordMock.calledWith(sinon.match.any, user.email, user.password));
        assert(createUserInDbMock.calledOnce);
        assert(destroyNonActivatedUserMock.calledOnce);
        assert(res.status.calledWith(201))
        assert(jsonMock.json.calledWith({token: 'user token'}))
        revertRewire();
      });
    });
  });
});

