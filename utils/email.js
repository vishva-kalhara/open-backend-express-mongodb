const nodemailer = require('nodemailer');

const sendEmail = async ({ toEmail: to, subject, content }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text: content,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
