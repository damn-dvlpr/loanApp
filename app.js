const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fs = require('file-system');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const shopRouter = require('./routes/shopRoutes');
const searchRouter = require('./routes/searchRoutes');
const utilsRouter = require('./routes/utilsRoutes');

// Set security HTTP headers
app.use(
	helmet({
		contentSecurityPolicy: false,
	})
);

// Limit reqs from same API (Current rate is 100 requests (max:100) pre hour (windowMs: 60*60*1000 miliseconds))
const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/shop/new', limiter);

// For parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Static file serving
app.use(express.static(__dirname + '/views'));

// For overriding 'GET' request in html to any http request
app.use(methodOverride('_method'));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization againsst XSS (Crosssite scripting)
app.use(xss());

// Prevent parameter pollution (eg: Removes 'id' and 'type' in localhost/shop?id=213&type=something)
app.use(hpp());

// Compression using g-zip
app.use(compression());

// Logging middlerware
if (process.env.NODE_ENV === 'development') {
	app.use((req, res, next) => {
		const date = Date(Date.now()).toString();
		console.log(date);
		fs.appendFile(
			'./log/logs.txt',
			date + ` ${req.method} ${req.originalUrl} \n`,
			function (err) {
				if (!err) {
					next();
				} else console.log(err);
			}
		);
	});
}
// ROUTES
app.get('/', function (req, res) {
	res.redirect('/shop');
});
app.use('/shop', shopRouter);
app.use('/search', searchRouter);
app.use('/printReciept', utilsRouter);

module.exports = app;
