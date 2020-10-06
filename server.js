const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Handles Error: UNCAUGHTEXCEPTION
process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	console.log(err);
	console.log(err.name, err.message);
	process.exit(1);
});

// For accessing the config file
dotenv.config({ path: './config/config.env' });

const app = require('./app');

// Assigns the DB URI. If DATABASE_CLOUD is present then it also replaces the '<password>' in the DATABASE_CLOUD string to the DATABASE_PASSWORD
const DB =
	process.env.DATABASE_LOCAL ||
	process.env.DATABASE_CLOUD.replace(
		'<password>',
		process.env.DATABASE_PASSWORD
	);

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(DB, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true,
		});
		console.log(`Database connected: ${conn.connection.host}`);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

// Connects to the DB
connectDB();

const port = process.env.PORT || 1337;
const server = app.listen(port, () => {
	console.log(`Listining on port ${port}`);
});

// Handles Error: UNHANDLEDREJECTION
process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
	console.log(err);
	server.close(() => {
		process.exit(1);
	});
});
