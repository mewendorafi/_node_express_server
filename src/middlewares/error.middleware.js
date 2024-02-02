const http = require('http-status');
const ApiError = require('../utils/ApiError');
const { config, logger } = require('../config');
const { Error: MongooseError } = require('mongoose');

const errorConverter = (err, req, res, next) => {
	let error = err;
	if (!(error instanceof ApiError)) {
		const statusCode =
			error.statusCode || error instanceof MongooseError ? http.BAD_REQUEST : http.INTERNAL_SERVER_ERROR;
		const message = error.message || http[statusCode];
		error = new ApiError(statusCode, message, false, err.stack);
	}
	next(error);
};

const errorHandler = (err, req, res, next) => {
	let { statusCode, message } = err;
	if (config.ENV === 'production' && !err.isOperational) {
		statusCode = http.INTERNAL_SERVER_ERROR;
		message = http[http.INTERNAL_SERVER_ERROR];
	}

	res.locals.errorMessage = err.message;

	const response = {
		code: statusCode,
		message,
		...(config.ENV === 'development' && { stack: err.stack }),
	};

	if (config.ENV === 'development') logger.error(err);

	res.status(statusCode).send(response);
};

module.exports = {
	converter: errorConverter,
	handler: errorHandler,
};
