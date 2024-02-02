const app = require('./app');
const { config, logger } = require('./config');
const connectDatabase = require('./database/connection');

let server = null;
connectDatabase().then(({ isConnected }) => {
	if (isConnected)
		return (server = app.listen(config.PORT, () => logger.info(`[SERVER] ... Listening on port ${config.PORT} ...`)));
});

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
	if (server) server.close();
});

//! DEBUG
// const _processLog = process;
// const _memoryUsage = process.memoryUsage();
// console.log(_memoryUsage);
// console.log(_processLog);
