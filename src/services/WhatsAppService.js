const TwilioService = require('./TwilioService');
const Logger = require('./Logger');

const sendVerificationCode = async (number, verificationCode) => {
  await TwilioService.sendMessage({
    from: 'whatsapp:+14155238886',
    body: `Your Spotifiuby verification code is ${verificationCode}`,
    to: `whatsapp:${number}`
  })
    .then(response => Logger.info(`Verification code sent to twilio for ${response.to}`))
    .catch(err => console.log(err));
};

module.exports = {sendVerificationCode};
