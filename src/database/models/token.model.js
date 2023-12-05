const mongoose = require('mongoose');
const { toJSON } = require('../plugins');
const { ACCESS, REFRESH, RESET_PASSWORD, VERIFY_EMAIL } = require('../../config/tokens.config');

const tokenSchema = new mongoose.Schema(
	{
		token: {
			type: String,
			required: true,
			index: true,
		},
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'users',
			required: true,
		},
		type: {
			type: String,
			enum: [REFRESH, ACCESS, RESET_PASSWORD, VERIFY_EMAIL, ],
			required: true,
		},
		expires: {
			type: Date,
			required: true,
		},
		banned: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// Add a plugin to the schema (converts mongoose to JSON)
tokenSchema.plugin(toJSON);

const Token = mongoose.model('tokens', tokenSchema);

module.exports = Token;
