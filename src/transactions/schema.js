const Joi = require('../utils/joi');

module.exports = Joi.object({
  _id: Joi.objectId(),
  cardId: Joi.objectId().required(),
  type: Joi.string().valid('fromMobile', 'toMobile', 'fromCard', 'toCard').required(),
  data: Joi.object({
    phoneNumber: Joi.string().length(10).regex(/^[0-9]+$/, 'numbers'),
    cardNumber: Joi.string().creditCard(),
  }),
  time: Joi.string().isoDate().default(() => new Date().toISOString(), 'time of creation'),
  sum: Joi.number().precision(2).required(),
}).options({
  stripUnknown: true,
});
