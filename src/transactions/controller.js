const transactionModel = require('./model');
const cardSchema = require('../cards/schema');

const transactionsController = {
  async getAll(ctx) {
    const id = await cardSchema.cardId.validate(ctx.params.id);
    ctx.body = await transactionModel.getAll(id);
  },
};

module.exports = transactionsController;
