require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const {jwtTokenGenerate, jwtTokenVerify} = require("./jwt");

app.use(bodyParser.json());

const nodemailer = require("nodemailer");

const port = process.env.PORT || 3003;

// godaddy email credentials
const godaddyEmail = process.env.GODADDY_EMAIL;
const godaddyPassword = process.env.GODADDY_EMAIL_PASSWORD;
const sendTo = process.env.SEND_TO;
const homeUrl = process.env.HOME_URL;
const whitePaperId1 = process.env.WHITEPAPER_ID_1;
const whitePaperId2 = process.env.WHITEPAPER_ID_2;
const whitePaperId3 = process.env.WHITEPAPER_ID_3;

const whitePapers = [whitePaperId1, whitePaperId2, whitePaperId3];

console.log(godaddyEmail);

var corsOptions = {
	origin: ["http://localhost"],
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors());

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
	const token = jwtTokenGenerate({id: whitePaperId1});
	const url = `${homeUrl}/verify?token=${token}`;
	res.send(url);
});

app.get("/verify", (req, res) => {
	const {token} = req.query;
	try {
		const {id} = jwtTokenVerify(token);
		res.redirect(`https://drive.google.com/uc?export=download&id=${id}`);
	} catch (error) {
		res.send("error");
	}
});

app.post("/email", async (req, res) => {
	const {name, phone, email, job_title, business_url, business_name, whitePaperNo} =
		req.body;

	const token = jwtTokenGenerate({id: whitePapers[whitePaperNo]});
	const url = `${homeUrl}/verify?token=${token}`;

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

	const mailToclient = {
		from: godaddyEmail,
		to: email,
		subject: "Welcome to Heystack",
		text: `
      Click the link to download the white paper

			${url}
    `,
	};

	try {
		// await mailTransport.sendMail(mailOptions);

		await mailTransport.sendMail(mailToclient);

		res.send({
			error: false,
			message: "success",
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
module.exports = app;