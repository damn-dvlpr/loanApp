const Girvi = require('../models/girviModel');
const PassbookInformation = require('../models/passbookInformationModel');

// Create a Girvi
exports.createGirvi = (req, res, next) => {
	const name = req.body.name;
	const address = req.body.address;
	const phone = req.body.phone;
	const item = req.body.item;
	const date = req.body.date;
	const weightGold = req.body.weightGold;
	const weightSilver = req.body.weightSilver;
	const amount = req.body.amount;
	const rate = req.body.rate;
	const metal = req.body.metal;
	const additionalInfo = req.body.additionalInfo;

	const girvi = {
		name: name,
		item: item,
		address: address,
		phone: phone,
		date: date,
		weightGold: weightGold,
		weightSilver: weightSilver,
		rate: rate,
		metal: metal,
		amount: amount,
		additionalInfo: additionalInfo,
	};
	Girvi.create(girvi, (err, returnedData) => {
		if (err) {
			console.log(err);
		} else {
			req.body.returnedData = returnedData;
			// console.log(returnedData);
			// console.log('New Girvi Created');
			res.redirect('/shop');
		}
	});
};

// Create a passbook entry
exports.createPassbook = (req, res) => {
	Girvi.findById(req.params.id, (err, foundGirvi) => {
		if (err) {
			console.log(err);
		} else {
			PassbookInformation.create(
				req.body.passbookInformation,
				(err, returnedInfo) => {
					if (err) {
						console.log(err);
					} else {
						foundGirvi.passbookInformation.push(returnedInfo);
						foundGirvi.save();
						// console.log(foundGirvi);
						res.redirect('/shop/' + req.params.id);
					}
				}
			);
		}
	});
};

// Updates a Girvi
exports.updateGirvi = (req, res) => {
	Girvi.findByIdAndUpdate(
		req.params.id,
		{ isDelivered: true, deliveryDate: Date.now() },
		(err, returnedData) => {
			if (err) {
				console.log(err);
			} else {
				// console.log(returnedData, 'Girvi marked Delivered!');
				res.redirect('/shop/' + req.params.id);
			}
		}
	);
};

// Deletes a Girvi
exports.deleteGirvi = (req, res) => {
	Girvi.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/shop');
		}
	});
};
