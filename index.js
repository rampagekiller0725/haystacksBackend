require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const {jwtTokenGenerate, jwtTokenVerify} = require("./src/jwt.js");
const {whitePapers} = require("./src/constants.js");
const {findRowByEmail, addRow} = require("./src/googlesheet.js");
const {sendMail} = require("./src/email.js");

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3003;

// godaddy email credentials
const godaddyEmail = process.env.GODADDY_EMAIL;
const godaddyPassword = process.env.GODADDY_EMAIL_PASSWORD;
const sendTo = process.env.SEND_TO;
const homeUrl = process.env.HOME_URL;

var corsOptions = {
	origin: ["http://localhost"],
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors());

app.get("/", (req, res) => {
	// const token = jwtTokenGenerate({id: whitePaperId1});
	// const url = `${homeUrl}/verify?token=${token}`;
	// res.send(url);
	res.send("welcome!");
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
	const {
		name,
		phone,
		email,
		job_title,
		business_url,
		business_name,
		whitePaperNo,
	} = req.body;

	try {
		const token = jwtTokenGenerate({id: whitePapers[whitePaperNo].id});
		const url = `${homeUrl}/verify?token=${token}`;

		const mailToclient = {
			from: godaddyEmail,
			to: email,
			subject: "Welcome to Heystack",
			text: `
      Click the link to download the white paper

			${url}
    `,
		};

		const existRow = await findRowByEmail(email);
		const whitePaperName = whitePapers[whitePaperNo].name;

		if (existRow) {
			// console.log(existRow);
			const docNames = existRow.get("Document Downloaded");

			if (
				docNames &&
				docNames.split(",").find((doc) => doc.trim() === whitePaperName)
			) {
				return res.json({
					error: false,
					message: "success",
					alreadySigned: true,
					url: url,
				});
			} else {
				existRow.set(
					"Document Downloaded",
					`${whitePaperName},${docNames}`
				);
				existRow.save();
				// send email
				sendMail(mailToclient);

				return res.json({
					error: false,
					message: "success",
					alreadySigned: false,
					url: url,
				});
			}
		} else {
			addRow({
				business_name,
				business_url,
				name,
				email,
				phone,
				docName: whitePaperName,
			});

			sendMail(mailToclient);

			return res.json({
				error: false,
				message: "success",
				alreadySigned: false,
				url: url,
			});
		}
	} catch (error) {
		console.log(error);
		return res.json({
			error: true,
		});
	}
});

app.listen(port, () => {
	console.log(`app listening on port ${port}`);
});

module.exports = app;
