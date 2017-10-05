const { checkTransaction } = require('./validator');
const { checkCardId } = require('../cards/validator');
const { getTransactions, createTransaction } = require('./model');
const { getCard } = require('../cards/model');

module.exports = {
  async getTransactions(ctx) {
    const id = checkCardId(ctx.params.id);
    ctx.body = await getTransactions(id);
  },

  async createTransaction(ctx) {
    let trans = ctx.request.body;
    trans.cardId = ctx.params.id;

    // Check transaction and check if card id exists
    trans = checkTransaction(trans);
    await getCard(trans.cardId);

    trans = await createTransaction(trans);
    ctx.status = 201;
    ctx.body = trans;
  },
};
