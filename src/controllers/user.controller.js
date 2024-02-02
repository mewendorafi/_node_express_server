const http = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const pickProps = require('../utils/pickObjectProperties');

const get = catchAsync(async (req, res) => {
	const user = await userService.queryById(req.params.uid);
	if (!user) throw new ApiError(http.NOT_FOUND, 'User not found');
	return res.status(http.OK).send(user);
});

const create = catchAsync(async (req, res) => {
	const user = await userService.create(req.body);
	return res.status(http.CREATED).send(user);
});

const update = catchAsync(async (req, res) => {
	const user = await userService.updateById(req.params.uid, req.body);
	return res.status(http.OK).send(user);
});

const remove = catchAsync(async (req, res) => {
	const user = await userService.deleteById(req.params.uid);
	return res.status(http.OK).send(user);
});

const queryAll = catchAsync(async (req, res) => {
	const filter = pickProps(req.query, ['name', 'role']);
	const options = pickProps(req.query, ['sortBy', 'limit', 'page']);
	const users = await userService.queryAll(filter, options);
	return res.status(http.OK).send(users);
});

module.exports = { get, create, update, remove, queryAll };
