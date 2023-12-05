const allRoles = {
	user: [],
	admin: ['getUsers', 'manageUsers'],
};

const ROLES = Object.keys(allRoles);
const ROLE_RIGHTS = new Map(Object.entries(allRoles));

module.exports = {
	ROLES,
	ROLE_RIGHTS,
};
