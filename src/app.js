const express = require('express');

const helmet = require('helmet');
const compression = require('compression');
const xss = require('xss-clean');
const mongo_sanitize = require('express-mongo-sanitize');
const cors = require('cors');
const passport = require('passport');
const logger = require('morgan');
const http = require('http-status');

const ApiError = require('./utils/ApiError.js');

const { config, jwt: jwtConfig } = require('./config');
const { errorMiddleware, authLimiterMiddleware } = require('./middlewares');

const routerIndex = require('./routes');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Handle URL-encoded form data parsing of POST request body
// "extended" option allows for rich objects and arrays to be encoded into the URL-encoded format
// [true] use qs ("query string") library to handle parsing of rich (deeply nested) objects and arrays
// [false] use NodeJS built-in querystring library to parse in a flat object format (values are either strings or arrays of strings)
app.use(express.urlencoded({ extended: true }));

// Sanitize request data against xss and query injection
app.use(xss());
app.use(mongo_sanitize());

// Gzip payload compression
app.use(compression());

// Enable CORS (Cross Origin Resource Sharing)
app.use(cors());
app.options('*', cors());

// JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtConfig);

// Log routes outputs to console in development mode
app.use(logger('dev'));

// Limit repeated failed requests to auth endpoints
if (config.ENV === 'production') {
	app.use('/auth', authLimiterMiddleware);
}

//! Call the router before calling the error middlewares, otherwise API requests won't work
// API routes
app.use('/', routerIndex);

// Catch 404 and forward to error handler for any unknown API request
app.use((req, res, next) => {
	next(new ApiError(http.NOT_FOUND, 'Not found'));
});

// Convert error to custom class ApiError if needed
app.use(errorMiddleware.converter);

// Error handler
app.use(errorMiddleware.handler);

module.exports = app;
