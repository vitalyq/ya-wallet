const cardModel = require('../cards/model');
const transModel = require('../transactions/model');
const cardSchema = require('../cards/schema');
const operationSchema = require('./schema');

const operationsController = {
  async cardToMobile(ctx) {
    const id = cardSchema.cardId.validate(ctx.params.id);
    const amount = operationSchema.amount.validate(ctx.request.body.amount);
    let trans = {
      cardId: id,
      type: 'cardToMobile',
      data: '9007771100',
      time: new Date().toISOString(),
      sum: amount,
    };

    await cardModel.charge(id, amount);
    trans = await transModel.create(trans);
    ctx.status = 201;
    ctx.body = trans;
  },
};

module.exports = operationsController;
