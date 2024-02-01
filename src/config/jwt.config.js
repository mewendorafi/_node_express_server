const { JWT } = require('../config/env.config');
const User = require('../database/models');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { TOKEN_TYPES } = require('../config/tokens.config');

const options = {
	secretOrKey: JWT.SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const verify = async (payload, done) => {
	console.log(payload)
	try {
		if (payload.type !== TOKEN_TYPES.ACCESS) {
			throw new Error('Invalid token type');
		}
		const user = await User.findById(payload.sub);
		if (!user) {
			return done(null, false);
		}
		done(null, user);
	} catch (error) {
		done(error, false);
	}
};

const jwtStrategy = new Strategy(options, verify);

module.exports = jwtStrategy;
