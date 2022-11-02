const Girvi = require('../models/girviModel');

// Searches for a Girvi amount
exports.findGirvi = (req, res) => {
	Girvi.find(
		{
			name: {
				$regex: new RegExp(req.body.name, 'ig'),
			},
		},
		function (err, returnedData) {
			if (err) {
				console.log(err);
			} else {
				res.render('results.ejs', { girvi: returnedData });
			}
		}
	).sort({ date: 1 });
};
