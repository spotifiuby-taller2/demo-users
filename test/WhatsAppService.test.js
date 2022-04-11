const rewire = require("rewire");
const sinon = require('sinon');
const assert = require('assert');
const _ = rewire('../src/services/TwilioService');
const WhatsAppService = rewire('../src/services/WhatsAppService');

describe('WhatsAppService', function () {
  it('Sends messages via twilio', function () {
    const sendMessageMock = sinon.fake.returns(Promise.resolve('some response'));
    WhatsAppService.__set__({
      TwilioService: {sendMessage: sendMessageMock}
    })
    const number = 'some number';
    const verificationCode = '1234';

    WhatsAppService.sendVerificationCode(number, verificationCode);

    assert(sendMessageMock.calledWith(sinon.match.has('to', `whatsapp:${number}`)
      .and(sinon.match.has('body', sinon.match(verificationCode)))));
  });
});
