const { Router } = require('express');
const router = Router();

const user = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

// When declaring "*" as the path, the callback function systematically executes before calling any route
// Or, you can scope it to only some paths of the /users endpoint, like so: router.all('/path')

// router.all('*', (req, res, next) => {
// 	const task = 'do something before calling any route'
// 	next()
// })

router.post('/', auth('manageUsers'), user.create);

router.get('/all', auth('getUsers'), user.queryAll);

// The .route() method allows to append multiple methods onto the same route path name
router
	.route('/:uid')
	.get(auth('getUsers'), user.get)
	.patch(auth('manageUsers'), user.update)
	.delete(auth('manageUsers'), user.remove);

module.exports = router;
