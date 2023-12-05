const http = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');

const register = catchAsync(async (req, res) => {
	const newUser = await userService.create(req.body);
	const tokens = await tokenService.generateAuthTokens(newUser);
	res.status(http.CREATED).send({ newUser, tokens });
});

const login = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	const user = await authService.login(email, password);
	const tokens = await tokenService.generateAuthTokens(user);
	res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
	await authService.logout(req.body.refreshToken);
	res.status(http.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

// const forgotPassword = catchAsync(async (req, res) => {
//   const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
//   await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
//   res.status(http.NO_CONTENT).send();
// });

// const resetPassword = catchAsync(async (req, res) => {
//   await authService.resetPassword(req.query.token, req.body.password);
//   res.status(http.NO_CONTENT).send();
// });

// const sendVerificationEmail = catchAsync(async (req, res) => {
//   const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
//   await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
//   res.status(http.NO_CONTENT).send();
// });

// const verifyEmail = catchAsync(async (req, res) => {
//   await authService.verifyEmail(req.query.token);
//   res.status(http.NO_CONTENT).send();
// });

module.exports = {
	register,
	login,
	logout,
	refreshTokens,
	// forgotPassword,
	// resetPassword,
	// sendVerificationEmail,
	// verifyEmail,
};
