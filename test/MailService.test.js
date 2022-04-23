const rewire = require('rewire');
const sinon = require('sinon');
const assert = require('assert');
const MailService = rewire('../src/services/MailService');

const email = 'test@test.com';
const link = 'somelink.com';

describe('MailService', function () {

  let fakeSendMail;
  let revertRewire;

  before(function () {
    fakeSendMail = sinon.fake.returns({message: {}});
    revertRewire = MailService.__set__({
      transporter: {sendMail: fakeSendMail},
    });
  });

  describe('sendConfirmationEmail', function () {
    it('sends confirmation to provided email with subject and link', async function () {
      await MailService.sendConfirmationEmail(email, "", link);

      assert(fakeSendMail.calledWith(sinon.match.has('to', email)
        .and(sinon.match.has('subject', 'Confirmación de cuenta'))
        .and(sinon.match.has('html', sinon.match(link)))));
    });
  });

  describe('sendPasswordRecoveryEmail', function () {
    it('sends recovery to provided email with subject and link', async function () {
      await MailService.sendPasswordRecoveryEmail(email, link);

      assert(fakeSendMail.calledWith(sinon.match.has('to', email)
        .and(sinon.match.has('subject', 'Restablecer contraseña'))
        .and(sinon.match.has('html', sinon.match(link)))));
    });
  });

  after(function () {
    revertRewire();
  });
});
