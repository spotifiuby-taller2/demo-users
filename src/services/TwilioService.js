const {TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN} = require('../others/constants');
const TwilioService = () => require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports = {
  sendMessage: (params) => TwilioService().messages.create(params)
};
