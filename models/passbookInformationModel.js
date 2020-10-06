const mongoose = require('mongoose');

const passbookInformationSchema = new mongoose.Schema({
	description: String,
	amountDeposit: Number,
	date: { type: Date, default: Date.now() },
});
const PassbookInformation = mongoose.model(
	'PassbookInformation',
	passbookInformationSchema
);

module.exports = PassbookInformation;
