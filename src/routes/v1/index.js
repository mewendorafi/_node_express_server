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
			</body>
		</html>
	`);
});

const DEFAULT_ROUTES = [
	{
		path: '/auth',
		route: authRouter,
	},
	{
		path: '/users',
		route: usersRouter,
	},
	// extend ...
];

DEFAULT_ROUTES.forEach(route => {
	router.use(route.path, route.route);
});

module.exports = router;
