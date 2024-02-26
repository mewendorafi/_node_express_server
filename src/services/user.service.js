const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const User = require('../database/models/user.model');

async function create(body) {
	if (await User.isEmailTaken(body.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
	}
	return User.create(body);
}

async function queryAll(filter, options) {
	const users = await User.paginate(filter, options);
	return users
}

function queryById(uid) {
	return User.findById(uid);
}

function queryByEmail(email) {
	return User.findOne({ email });
}

async function updateById(uid, body) {
	const user = await queryById(uid);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	if (body.email && (await User.isEmailTaken(body.email, uid))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
	Object.assign(user, body);
	await user.save();
	return user;
}

async function deleteById(uid) {
	const user = await queryById(uid);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}
	await user.remove();
	return user;
}

module.exports = {
	create,
	queryAll,
	queryById,
	queryByEmail,
	updateById,
	deleteById,
};
