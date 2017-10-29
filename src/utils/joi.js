const Joi = require('joi');
const ObjectID = require('mongodb').ObjectID;
Joi.objectId = require('eko-joi-objectid')(Joi, ObjectID);

module.exports = Joi;
