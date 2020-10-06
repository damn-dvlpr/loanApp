const mongoose = require('mongoose');

const girviSchema = new mongoose.Schema({
	name: String,
	address: String,
	phone: Number,
	item: String,
	date: Date,
	metal: String,
	weightGold: Number,
	weightSilver: { type: Number, default: 0 },
	amount: Number,
	rate: Number,
	isDelivered: { type: Boolean, default: false },
	deliveryDate: { type: Date, default: new Date('01-01-1500') },
	additionalInfo: String,
	passbookInformation: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'PassbookInformation',
		},
	],
});

const Girvi = mongoose.model('Girvi', girviSchema);

module.exports = Girvi;
