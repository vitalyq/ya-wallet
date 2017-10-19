const Joi = require('joi');

module.exports = {
  amount: Joi.number().precision(2).greater(0).required(),
};
