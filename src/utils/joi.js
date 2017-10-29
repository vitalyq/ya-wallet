const createError = require('http-errors');
const Joi = require('joi');
const ObjectID = require('mongodb').ObjectID;

// Add ObjectID support
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectID);

// Koa middleware, converts Joi errors to HTTP errors
Joi.middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    throw err.name === 'ValidationError' ?
      createError(400, err.details[0].message) :
      err;
  }
};

module.exports = Joi;
