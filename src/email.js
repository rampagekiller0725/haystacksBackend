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
		await mailTransport.sendMail(mailOption);
		return true;
	} catch (error) {
		console.log("--", error);
		return false;
	}
}

module.exports ={
  sendMail
}