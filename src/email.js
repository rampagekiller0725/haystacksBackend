const nodemailer = require("nodemailer");

const godaddyEmail = process.env.GODADDY_EMAIL;
const godaddyPassword = process.env.GODADDY_EMAIL_PASSWORD;

const mailTransport = nodemailer.createTransport({
	host: "smtpout.secureserver.net",
	secure: true,
	secureConnection: false, // TLS requires secureConnection to be false
	tls: {
		ciphers: "SSLv3",
	},
	requireTLS: true,
	port: 465,
	debug: true,
	auth: {
		user: godaddyEmail,
		pass: godaddyPassword,
	},
});

/**
 * @description send email
 */
const sendMail = async (mailOption) => {
  try {
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