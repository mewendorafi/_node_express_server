const { set, connect } = require('mongoose');
const { config, logger } = require('../config');

// If strictQuery is set to true, mongoose removes any query conditions with a value of undefined.
// This is to avoid unintended CRUD operations when using variables in queries.
set('strictQuery', true);

module.exports = async function connectDatabase() {
	try {
		await connect(config.MONGOOSE.URL);
		logger.info(`[DATABASE] ... Connected to ${config.MONGOOSE.URL} ...`);
		return { isConnected: true };
	} catch (error) {
		logger.error('[DATABASE] ... Unable to connect:', error);
		return { isConnected: false };
	}
};
