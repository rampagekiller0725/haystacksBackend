const {GoogleSpreadsheet} = require("google-spreadsheet");
const {JWT} = require("google-auth-library");

const spreadSheetId = process.env.SPREADSHEETID;

const serviceAccountAuth = new JWT({
	email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
	key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join("\n"),
	scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(spreadSheetId, serviceAccountAuth);


(async function () {
  await doc.loadInfo();
})();

/**
 * @description Add new row to the given sheet
 * @param {number} sheetIndex
 * @param {object} row
 */
const addRow = async (row, sheetIndex = 2) => {
	const sheet = doc.sheetsByIndex[sheetIndex];

	const {business_name, business_url, name, email, phone, docName} = row;

	return await sheet.addRow({
		Business: business_name,
		Phone: phone,
		Date: new Date(),
		Website: business_url,
		"Owner Full name": name,
		"Owner(s) Email": email,
		"Document Downloaded": docName
	});
};

/**
 * @description Find row by given email
 * @param {string} email
 * @param {number} sheetIndex
 * @return {boolean} row if existing, undefined if not
 */
const findRowByEmail = async (email, sheetIndex = 2) => {
	const sheet = doc.sheetsByIndex[sheetIndex];

	const rows = await sheet.getRows();

	return rows.find((row) => row.get("Owner(s) Email") === email);
};

module.exports = {
	["addRow"]: (row, sheetIndex) => addRow(row, sheetIndex),
	["findRowByEmail"]: (email, sheetIndex) =>
		findRowByEmail(email, sheetIndex),
};
