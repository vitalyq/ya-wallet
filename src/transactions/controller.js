const Joi = require('../utils/joi');
const transactionModel = require('./model');

const transactionsController = {
  async getAll(ctx) {
    const id = await Joi.objectId().validate(ctx.params.id);
    ctx.body = await transactionModel.getAll(id);
  },
};

module.exports = transactionsController;
