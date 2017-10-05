const { checkCardId } = require('../cards/validator');
const { checkTransaction } = require('./validator');
const { getTransactions, createTransaction } = require('./model');

module.exports = {
  async getTransactions(ctx) {
    const id = checkCardId(ctx.params.id);
    ctx.body = await getTransactions(id);
  },

  async createTransaction(ctx) {
    let trans = ctx.request.body;
    trans.cardId = ctx.params.id;
    trans = checkTransaction(trans);
    trans = await createTransaction(trans);
    ctx.status = 201;
    ctx.body = trans;
  },
};
