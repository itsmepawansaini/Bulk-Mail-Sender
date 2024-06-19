const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const EMAIL_ADDRESS = '709e7d001@smtp-brevo.com';
const EMAIL_PASSWORD = 'dJLE2SImqO6rYc0R';
const SMTP_SERVER = 'smtp-relay.brevo.com';
const SMTP_PORT = 587;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/send-email', async (req, res) => {
    const { to, subject, body } = req.body;

    const recipientsArray = to.split('\n').map(email => email.trim());

    try {
        for (const recipient of recipientsArray) {
            await sendEmail(recipient, subject, body);
        }
        res.send(`Emails Sent Successfully To All Recipients`);
    } catch (error) {
        res.status(500).send(`Error Sending Emails: ${error.message}`);
    }
});

async function sendEmail(to, subject, body) {
    let transporter = nodemailer.createTransport({
        host: SMTP_SERVER,
        port: SMTP_PORT,
        secure: false,
        auth: {
            user: EMAIL_ADDRESS,
            pass: EMAIL_PASSWORD,
        },
    });

    let mailOptions = {
        from: '"Pawan Saini" <pawan.artistonk@gmail.com>',
        to: to,
        subject: subject,
        text: body,
        replyTo: 'hr@artistonk.com',
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email Sent To ${to}`);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is Running On Port${PORT}`);
});
