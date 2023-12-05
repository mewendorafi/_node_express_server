const http = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pickProperties = require('../utils/pickObjectProperties');
const user = require('../services/user.service');

const get = catchAsync(async (req, res) => {
	const user = await user.queryById(req.params.uid);
	if (!user) throw new ApiError(http.NOT_FOUND, 'User not found');
	return res.status(http.OK).send(user);
});

const create = catchAsync(async (req, res) => {
	const user = await user.create(req.body);
	return res.status(http.CREATED).send(user);
});

const update = catchAsync(async (req, res) => {
	const user = await user.updateById(req.params.uid, req.body);
	return res.status(http.OK).send(user);
});

const destroy = catchAsync(async (req, res) => {
	const user = await user.deleteById(req.params.uid);
	return res.status(http.OK).send(user);
});
const queryAll = catchAsync(async (req, res) => {
	const filter = pickProperties(req.query, ['name', 'role']);
	const options = pickProperties(req.query, ['sortBy', 'limit', 'page']);
	const users = await user.queryAll(filter, options);
	return res.status(http.OK).send(users);
});

module.exports = { get, create, update, destroy, queryAll };
