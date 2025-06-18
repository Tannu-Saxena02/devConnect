const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    secure: true, // true for port 465
      auth: {
        user: process.env.SMPT_MAIL,// your Gmail
        pass:process.env.SMPT_APP_PASS,  // your Gmail app password
      },
    authMethod: "LOGIN", // Specify the authentication method
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.to,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
