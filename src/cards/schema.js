const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = Joi.object({
  _id: Joi.objectId(),
  cardNumber: Joi.string().creditCard().required(),
  balance: Joi.number().precision(2).min(0).default(0),
}).options({
  stripUnknown: true,
});
