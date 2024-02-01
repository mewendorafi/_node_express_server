const bcrypt = require('bcryptjs');
const validator = require('validator');
const { Schema, model } = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const { ROLES } = require('../../config/roles.config');

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid email');
				}
			},
		},
		password: {
			type: String,
			required: true,
			minLength: 8,
			trim: true,
			private: true, // used by plugin toJSON
			validate(value) {
				if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
					throw new Error('Password must contain at least one letter and one number');
				}
			},
		},
		role: {
			type: String,
			enum: ROLES,
			default: 'user',
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true, // mongoose option to auto-assign "createdAt" and "updatedAt" fields on document
	}
);

// schema plugin to convert mongoose to JSON
userSchema.plugin(toJSON);
// pagination feature on requests
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
	const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
	const user = this;
	return bcrypt.compare(password, user.password);
};

// pre-save function to execute before every user save
userSchema.pre('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 12);
	}
	next();
});

module.exports = model('users', userSchema);
