var nodemailer = require('nodemailer');
const dotenv = require('dotenv')

dotenv.config({
    path: './.env'
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "contact.quizzy.com@gmail.com",
        pass: "quizzy.contact.2021"
    }
});



module.exports = email = {
    mail: (emailto, subj, mesg) => {
        var mailOptions = {
            from: 'contact.quizzy.com@gmail.com',
            to: emailto,
            subject: subj,
            text: mesg
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },
};