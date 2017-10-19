const Joi = require('joi');

module.exports = {
  cardId: Joi.number().integer().min(0).required(),

  card: Joi.object({
    cardNumber: Joi.string().creditCard().required(),
    balance: Joi.number().precision(2).min(0).default(0),
  }).options({
    stripUnknown: true,
  }),
};
