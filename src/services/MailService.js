const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const Logger = require("./Logger");
const { SENDGRID_API_KEY } = require("../others/constants");

const config = {
    auth: {
        api_key: SENDGRID_API_KEY
    }
};

const transporter = nodemailer.createTransport( sgTransport(config) );

async function sendConfirmationEmail(email, link) {
    const mailOptions = {
        from: 'cuentadetaller2@gmail.com',

        to: email,

        subject: 'Confirmación de cuenta',

        html: `Para confirmar tu cuenta, por favor accedé a este link: `
              + `<a clicktracking=off href=${link}> este link </a>`,

        trackingSettings: {
            clickTracking: {
                enable: false,
                enableText: false
            },
            openTracking: {
                enable: false
            }
        }
    };

    const response = await transporter.sendMail(mailOptions);

    if (response.message === undefined) {
        throw new Error();
    }
}

module.exports = {
    sendConfirmationEmail
};