const nodemailer = require('nodemailer')

const sendEmail = async(email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.APP_PASS
        },
        secure: true
    })

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Email Verification from SHOPPER",
        text: `Your OTP code is ${otp}`
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }

}

module.exports = sendEmail
