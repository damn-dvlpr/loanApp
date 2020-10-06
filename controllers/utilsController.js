const Girvi = require('../models/girviModel');
const days = require('days360');
const fmt = require('indian-number-format');

// Shows the page with only the reciept and print btn
exports.getPrintReciept = async (req, res, next) => {
	await Girvi.findById(req.params.id)
		.populate('passbookInformation')
		.exec((err, foundData) => {
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
					const totalAmount = fmt.format(
						Math.ceil((foundData.rate / 3000) * foundData.amount * totaldays) +
							foundData.amount
					);
					res.render('reciept.ejs', {
						girvi: foundData,
						months: months,
						days: day,
						totalAmount: totalAmount,
					});
				}
			}
		});
};
