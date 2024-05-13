require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const nodemailer = require("nodemailer");

const port = process.env.PORT || 3003;
console.log(process.env.GODADDY_EMAIL);
// godaddy email credentials
const godaddyEmail = process.env.GODADDY_EMAIL;
const godaddyPassword = process.env.GODADDY_EMAIL_PASSWORD;
const sendTo = process.env.SEND_TO;

var corsOptions = {
	origin: [""],
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

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

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.post("/email", cors(corsOptions), (req, res) => {
	const {name, phone, email, job_title, business_url, business_name} =
		req.body;

	const mailOptions = {
		from: godaddyEmail,
		to: sendTo,
		subject: "White paper forms",
		text: `
      Hi Seth,

      Name:     ${name}
      Email:    ${email}
      Phone:    ${phone}
      Job Title: ${job_title}
      Business Name: ${business_name}
      Business URL:  ${business_url}
    `,
	};

	try {
		mailTransport
			.sendMail(mailOptions)
			.then(() => {
				res.send({
					error: false,
					message: "success",
				});
			})
			.catch((err) => {
				console.log("err", err);
				res.send({
					error: true,
					message: "error",
				});
			});
	} catch (error) {
		console.log(error);
		res.send({
			error: true,
			message: "error",
		});
	}
  
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
