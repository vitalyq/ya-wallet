const { chargeCard } = require('../cards/model');
const { checkCardId } = require('../cards/validator');
const { createTransaction } = require('../transactions/model');

module.exports = {
  async payForCell(ctx) {
    const amount = Number(ctx.request.body.amount);
    const id = checkCardId(ctx.params.id);
    const trans = {
      cardId: id,
      type: 'paymentMobile',
      data: '9007771100',
      time: new Date().toISOString(),
      sum: amount,
    };

    await chargeCard(id, amount);
    await createTransaction(trans);
    ctx.status = 201;
  },
};
