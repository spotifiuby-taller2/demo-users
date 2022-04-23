const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const { SENDGRID_API_KEY } = require("../others/constants");

const config = {
    auth: {
        api_key: SENDGRID_API_KEY
    }
};

const transporter = nodemailer.createTransport( sgTransport(config) );

async function sendEmail(email,
                         subject,
                         body) {
    const mailOptions = {
        from: 'cuentadetaller2@gmail.com',

        to: email,

        subject,

        html: body,

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

async function sendConfirmationEmail(email,
                                     pin,
                                     link) {
    const body = `
    Para confirmar tu cuenta, por favor accedé a: `
    + `<a clicktracking=off href=${link}> este link </a>`;

    await sendEmail(email,
              'Confirmación de cuenta',
              body);
}

async function sendPasswordRecoveryEmail(email,
                                         link) {
    const body = `
    Para recrear tu contraseña, por favor accedé a: `
        + `<a clicktracking=off href=${link}> este link </a>`;

    await sendEmail(email,
            'Restablecer contraseña',
            body);
}

module.exports = {
    sendConfirmationEmail,
    sendPasswordRecoveryEmail
};
