const Girvi = require('../models/girviModel');
const days = require('days360');
const fmt = require('indian-number-format');

// Shows the shop view
exports.getShopView = (req, res) => {
	Girvi.find({})
		.sort({ date: -1 })
		.exec((err, returnedData) => {
			if (err) {
				console.log(err);
			} else {
				res.render('shop.ejs', { girvi: returnedData });
			}
		});
};

// Shows the new Girvi form
exports.getNewGirviView = (req, res) => {
	res.render('new.ejs');
};

// Shows the created Girvi form
exports.getGirviView = async (req, res, next) => {
	const id = req.params.id;
	await Girvi.findById(req.params.id)
		.populate('passbookInformation')
		.exec(function (err, foundData) {
			if (err) {
				console.log(err);
			} else {
				if (foundData) {
					const months =
						Math.floor(days(new Date(foundData.date), new Date()) / 30) +
						' Months';
					const day =
						(days(new Date(foundData.date), new Date()) % 30) + ' Days';
					const totaldays = days(new Date(foundData.date), new Date());
					const simpleInterest = fmt.format(
						Math.ceil((foundData.rate / 3000) * foundData.amount * totaldays)
					);
					const amount = fmt.format(foundData.amount);
					res.render('show.ejs', {
						id: id,
						girvi: foundData,
						months: months,
						days: day,
						simpleInterest: simpleInterest,
						amount: amount,
					});
				}
			}
		});
};

// Shows the passbook form
exports.getNewPassbookFormView = (req, res) => {
	res.render('passbookForm.ejs', { id: req.params.id });
};

// Show the search form
exports.getSearchView = (req, res) => {
	res.render('search.ejs');
};
