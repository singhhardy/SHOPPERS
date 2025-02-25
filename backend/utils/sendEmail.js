const nodemailer = require('nodemailer')

const sendEmail = async({to, subject, text, html }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASS
        },
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
        html 
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`)
    } catch (error) {
        console.log(`Error sending OTP email:', ${error}`)
    }
}

module.exports = sendEmail
