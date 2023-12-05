const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

/*
dotenv.config() is called, with the path option
set to the absolute path of the .env file,
to load environment variables.

path.join() concatenates the __dirname variable
(current directory of the script file)
with the .env file's relative path,
which resolves the absolute path to the .env file.
*/
dotenv.config({ path: path.join(__dirname, '../../.env') });

const envValidationSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
		PORT: Joi.number().default(3000),
		MONGODB_URL: Joi.string().required().description('MongoDB URL'),
		JWT_SECRET: Joi.string().required().description('JWT secret key'),
		JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('Minutes after which access tokens expire'),
		JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('Days after which refresh tokens expire'),
		JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
			.default(10)
			.description('Minutes after which reset password token expires'),
		JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
			.default(10)
			.description('Minutes after which verify email token expires'),
		SMTP_HOST: Joi.string().description('Server that will send the emails'),
		SMTP_PORT: Joi.number().description('Port to connect to the email server'),
		SMTP_USERNAME: Joi.string().description('Username for email server'),
		SMTP_PASSWORD: Joi.string().description('Password for email server'),
		EMAIL_FROM: Joi.string().description('The from field in the emails sent by the app'),
	})
	.unknown();

const { value: envSchema, error } = envValidationSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

module.exports = {
	ENV: envSchema.NODE_ENV,
	PORT: envSchema.PORT,
	MONGOOSE: {
		DB_NAME: envSchema.DB_NAME,
		URL: envSchema.MONGODB_URL + (envSchema.NODE_ENV === 'test' ? '-test' : ''),
	},
	JWT: {
		SECRET: envSchema.JWT_SECRET,
		ACCESS_EXPIRATION_MINUTES: envSchema.JWT_ACCESS_EXPIRATION_MINUTES,
		REFRESH_EXPIRATION_DAYS: envSchema.JWT_REFRESH_EXPIRATION_DAYS,
		RESET_PASSWORD_EXPIRATION_MINUTES: envSchema.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
		VERIFY_EMAIL_EXPIRATION_MINUTES: envSchema.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
	},
	EMAIL: {
		SMTP: {
			HOST: envSchema.SMTP_HOST,
			PORT: envSchema.SMTP_PORT,
			AUTH: {
				USER: envSchema.SMTP_USERNAME,
				PASS: envSchema.SMTP_PASSWORD,
			},
		},
		FROM: envSchema.EMAIL_FROM,
	},
};
