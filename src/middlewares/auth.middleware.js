const http = require('http-status');
const passport = require('passport');
const ApiError = require('../utils/ApiError');
const { ROLE_RIGHTS } = require('../config/roles.config');

function verifyCallback(req, resolve, reject, requiredRights) {
	return async (err, user, info) => {
		if (err || info || !user) return reject(new ApiError(http.UNAUTHORIZED, 'Please authenticate'));
		req.user = user;

		if (requiredRights.length) {
			const userRights = ROLE_RIGHTS.get(user.role);
			const hasRequiredRights = requiredRights.every(requiredRight => userRights.includes(requiredRight));
			if (!hasRequiredRights && req.params.uid !== user.id) return reject(new ApiError(http.FORBIDDEN, 'Forbidden'));
		}

		resolve();
	};
}

//! Must be defined as arrow function, otherwise Express Router will crash (see more below)
const authMiddleware =
	(...requiredRights) =>
	async (req, res, next) => {
		return new Promise((resolve, reject) => {
			passport.authenticate(
				'jwt',
				{ session: false }, // disable session management
				verifyCallback(req, resolve, reject, requiredRights)
			)(req, res, next); // invoking the function returned by .authenticate()
		})
			.then(() => next())
			.catch(error => next(error));
	};

module.exports = authMiddleware;

/*
When referencing or calling a middleware function inside a controller/route,
the context must be kept global as the middleware relies on the value of the global "this" object.
So, using an arrow function ensures that the function maintains the surrounding lexical scope,
and does not create a new "this" context.
*/
