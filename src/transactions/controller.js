const transactionModel = require('./model');

const transactionsController = {
  async getAll(ctx) {
    ctx.body = await transactionModel.getAll();
  },
};

module.exports = transactionsController;
