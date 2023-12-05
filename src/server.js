const mongoose = require('mongoose');
const app = require('./app');
const { config, logger } = require('./config');

// If strictQuery is set to true, mongoose removes any query conditions with a value of undefined.
// This is to avoid unintended CRUD operations when using variables in queries.
mongoose.set('strictQuery', true);

let server = null;
mongoose
	.connect(config.MONGOOSE.URL)
	.then(() => {
		logger.info(`[DATABASE] Connected to Mongo | ${config.MONGOOSE.DB_NAME}`);
		server = app.listen(config.PORT, () => {
			logger.info(`[SERVER] Listening on port ${config.PORT}`);
		});
	})
	.catch(error => console.error('[DATABASE] Unable to connect |', error));

const exitHandler = () => {
	if (server)
		return server.close(() => {
			logger.info('[SERVER TERMINATED — CLEAN EXIT]');
			process.exit(1);
		});
	else return process.exit(1);
};

const unexpectedErrorHandler = error => {
	logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// SIGTERM means TERMinate SIGnal (signal to terminate the running process)
process.on('SIGTERM', () => {
	logger.info('[SIGTERM RECEIVED — SERVER TERMINATED]');
	if (server) {
		server.close();
	}
});

//! DEBUG
// const _processLog = process;
// const _memoryUsage = process.memoryUsage();
// console.log(_memoryUsage);
// console.log(_processLog);
