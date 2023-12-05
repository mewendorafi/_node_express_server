const errorMiddleware = require('./error.middleware');
const authMiddleware = require('./auth.middleware');
const authLimiterMiddleware = require('./rateLimiter.middleware');

module.exports = {
	errorMiddleware,
	authMiddleware,
	authLimiterMiddleware,
};
