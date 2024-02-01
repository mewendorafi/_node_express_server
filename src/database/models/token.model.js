const { toJSON } = require('../plugins');
const {
	Schema,
	Types: { ObjectId },
	model,
} = require('mongoose');
const { ACCESS, REFRESH, RESET_PASSWORD, VERIFY_EMAIL } = require('../../config/tokens.config');

const tokenSchema = new Schema(
	{
		token: {
			type: String,
			required: true,
			index: true,
		},
		user: {
			type: ObjectId,
			ref: 'users',
			required: true,
		},
		type: {
			type: String,
			enum: [REFRESH, ACCESS, RESET_PASSWORD, VERIFY_EMAIL],
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

// schema plugin to convert mongoose to JSON
tokenSchema.plugin(toJSON);

module.exports = model('tokens', tokenSchema);
