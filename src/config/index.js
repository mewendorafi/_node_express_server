const jwt = require('./jwt.config');
const config = require('./env.config');
const roles = require('./roles.config');
const tokens = require('./tokens.config');
const logger = require('./logger.config');
const morgan = require('./morgan.config');

module.exports = {
	config,
	jwt,
	roles,
	tokens,
	logger,
	morgan
};
