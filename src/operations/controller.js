const cardModel = require('../cards/model');
const transModel = require('../transactions/model');
const cardSchema = require('../cards/schema');
const operationSchema = require('./schema');

const operationsController = {
  async cardToMobile(ctx) {
    const id = await cardSchema.cardId.validate(ctx.params.id);
    const amount = await operationSchema.amount.validate(ctx.request.body.amount);
    let trans = {
      cardId: id,
      type: 'toMobile',
      data: { phoneNumber: '9007771100' },
      time: new Date().toISOString(),
      sum: -amount,
    };

    await cardModel.changeBalance(id, -amount);
    trans = await transModel.create(trans);
    ctx.status = 201;
    ctx.body = trans;
  },

  async cardToCard(ctx) {
    const idFrom = await cardSchema.cardId.validate(ctx.params.id);
    const idTo = await cardSchema.cardId.validate(ctx.request.body.receiverCardId);
    const amount = await operationSchema.amount.validate(ctx.request.body.amount);

    const cardTo = await cardModel.get(idTo);
    const transactions = {
      from: {
        cardId: idFrom,
        type: 'toCard',
        data: { cardNumber: cardTo.cardNumber },
        time: new Date().toISOString(),
        sum: -amount,
      },
      to: {
        cardId: idTo,
        type: 'fromCard',
        data: { cardNumber: cardTo.cardNumber },
        time: new Date().toISOString(),
        sum: amount,
      },
    };

    await cardModel.changeBalance(idFrom, -amount);
    await cardModel.changeBalance(idTo, amount);
    transactions.from = await transModel.create(transactions.from);
    transactions.to = await transModel.create(transactions.to);
    ctx.status = 201;
    ctx.body = transactions;
  },
};

module.exports = operationsController;
