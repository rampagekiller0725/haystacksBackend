const whitePaperId1 = process.env.WHITEPAPER_ID_1;
const whitePaperId2 = process.env.WHITEPAPER_ID_2;
const whitePaperId3 = process.env.WHITEPAPER_ID_3;

const whitePapers = [
	{
		id: whitePaperId1,
		name: "Testing Automation Framework Vision",
	},
	{
		id: whitePaperId2,
		name: "Testing Automation Strategy Overview",
	},
	{
		id: whitePaperId3,
		name: "Testing Automation Strategy Detail",
	},
];

module.exports = {
	whitePapers,
};
