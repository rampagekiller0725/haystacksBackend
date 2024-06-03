const nodemailer = require("nodemailer");

const godaddyEmail = process.env.GODADDY_EMAIL;
const godaddyPassword = process.env.GODADDY_EMAIL_PASSWORD;



/**
 * @description send email
 */
const sendMail = async (mailOption) => {
  try {
    const mailTransport = nodemailer.createTransport({
      host: "smtp.office365.com",
      // secure: true,
      secureConnection: true, // TLS requires secureConnection to be false
      tls: {
        ciphers: "SSLv3",
      },
      // requireTLS: true,
      port: 587,
      // debug: true,
      auth: {
        user: godaddyEmail,
        pass: godaddyPassword,
      },
    });

    console.log("sending email...")
		await mailTransport.sendMail(mailOption);
    console.log("email sent")
		return true;
	} catch (error) {
		console.log("email sending error", error);
		return false;
	}
}

module.exports ={
  sendMail
}