const { tokens } = require('../config');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Token = require('../database/models/token.model');
const userService = require('../services/user.service');
const { verifyToken, generateAuthTokens } = require('../services/token.service');

async function login(email, password) {
	const user = await userService.queryByEmail(email);
	if (!user || !(await user.isPasswordMatch(password)))
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
	return user;
}

async function logout(refreshToken) {
	const tokenObject = await Token.findOne({
		token: refreshToken,
		type: tokens.TOKEN_TYPES.REFRESH,
		banned: false,
	});
	if (!tokenObject) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
	await tokenObject.remove();
}

const refreshAuth = async refreshToken => {
	try {
		const refreshTokenDoc = await verifyToken(refreshToken, tokens.TOKEN_TYPES.REFRESH);
		const user = await userService.queryById(refreshTokenDoc.user);
		if (!user) throw new Error('User not found');
		await refreshTokenDoc.remove();
		return generateAuthTokens(user);
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
	}
};

// const resetPassword = async (resetPasswordToken, newPassword) => {
//   try {
//     const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, TOKENS_CONFIG.RESET_PASSWORD);
//     const user = await userService.getUserById(resetPasswordTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await userService.updateUserById(user.id, { password: newPassword });
//     await Token.deleteMany({ user: user.id, type: TOKENS_CONFIG.RESET_PASSWORD });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
//   }
// };

// const verifyEmail = async (verifyEmailToken) => {
//   try {
//     const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, TOKENS_CONFIG.VERIFY_EMAIL);
//     const user = await userService.getUserById(verifyEmailTokenDoc.user);
//     if (!user) {
//       throw new Error();
//     }
//     await Token.deleteMany({ user: user.id, type: TOKENS_CONFIG.VERIFY_EMAIL });
//     await userService.updateUserById(user.id, { isEmailVerified: true });
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
//   }
// };

module.exports = {
	login,
	logout,
	refreshAuth,
	// resetPassword,
	// verifyEmail,
};
