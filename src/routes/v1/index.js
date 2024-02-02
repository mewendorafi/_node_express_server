const express = require('express');
const router = express.Router();
const authRouter = require('./auth.route.js');
const usersRouter = require('./user.route.js');

// Index View
router.get('/', async (req, res) => {
	res.status(200).send(`
	  <!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title> Node Server </title>
			</head>
			<body style='height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: antiquewhite;'>
				<h1> Node Server </h1>
				<h2> Built With Express </h2>
				<h2> Deployed On Vercel </h2>
				<h3>Available routes:</h3>
				<h4>POST /auth/{{[register, login, logout, refresh-tokens]}}</h4>
				<h4>POST /users</h4>
				<h4>GET /users/all</h4>
				<h4>GET /users/:uid</h4>
				<h4>PATCH /users/:uid</h4>
				<h4>DELETE /users/:uid</h4>
				<p>...and more to come...</p>
				<p>Try out requests with any API testing tool</p>
			</body>
		</html>
	`);
});

const DEFAULT_ROUTES = [
	{
		path_prefix: '/auth',
		route: authRouter,
	},
	{
		path_prefix: '/users',
		route: usersRouter,
	},
	// extend ...
];

DEFAULT_ROUTES.forEach(route => {
	router.use(route.path_prefix, route.route);
});

module.exports = router;
