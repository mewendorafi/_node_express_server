// const http = require('http-status');
// const ApiError = require('../utils/ApiError');
// const userService = require('./user.service');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Token = require('../database/models/token.model');
const { config, tokens } = require('../config');

//! Don't declare it ASYNC or it will return a Promise instead of a token string !
function generateToken(userId, expires, type, secret = config.JWT.SECRET) {
	try {
		const payload = {
			sub: userId, // subject of the token
			iat: moment().unix(), // "issued at" date timestamp in seconds
			exp: expires.unix(), // expiration date
			type, // token type, ACCESS or REFRESH
		};
		return jwt.sign(payload, secret);
	} catch (error) {
		console.error(error);
	}
}

async function saveToken(token, userId, expires, type, banned = false) {
	try {
		const tokenObject = await Token.create({
			token,
			user: userId,
			expires: expires.toDate(),
			type,
			banned,
		});
		return tokenObject;
	} catch (error) {
		console.error(error);
	}
}

async function verifyToken(token, type) {
	const payload = jwt.verify(token, config.JWT.SECRET);
	const tokenObject = await Token.findOne({ token, type, user: payload.sub, banned: false });
	if (!tokenObject) throw new Error('Token not found');
	return tokenObject;
}

async function generateAuthTokens(user) {
	const accessTokenExpires = moment().add(config.JWT.ACCESS_EXPIRATION_MINUTES, 'minutes');
	const accessToken = generateToken(user.id, accessTokenExpires, tokens.TOKEN_TYPES.ACCESS);

	const refreshTokenExpires = moment().add(config.JWT.REFRESH_EXPIRATION_DAYS, 'days');
	const refreshToken = generateToken(user.id, refreshTokenExpires, tokens.TOKEN_TYPES.REFRESH);
	await saveToken(refreshToken, user.id, refreshTokenExpires, tokens.TOKEN_TYPES.REFRESH);

	return {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate(),
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate(),
		},
	};
}

// const generateResetPasswordToken = async (email) => {
//   const user = await userService.getUserByEmail(email);
//   if (!user) {
//     throw new ApiError(http.NOT_FOUND, 'No users found with this email');
//   }
//   const expires = moment().add(ENV.jwt.resetPasswordExpirationMinutes, 'minutes');
//   const resetPasswordToken = generateToken(user.id, expires, TOKEN_TYPES.RESET_PASSWORD);
//   await saveToken(resetPasswordToken, user.id, expires, TOKEN_TYPES.RESET_PASSWORD);
//   return resetPasswordToken;
// };

// const generateVerifyEmailToken = async (user) => {
//   const expires = moment().add(ENV.jwt.verifyEmailExpirationMinutes, 'minutes');
//   const verifyEmailToken = generateToken(user.id, expires, TOKEN_TYPES.VERIFY_EMAIL);
//   await saveToken(verifyEmailToken, user.id, expires, TOKEN_TYPES.VERIFY_EMAIL);
//   return verifyEmailToken;
// };

module.exports = {
	generateToken,
	saveToken,
	verifyToken,
	generateAuthTokens,
	// generateResetPasswordToken,
	// generateVerifyEmailToken,
};
