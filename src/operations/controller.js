const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const cardModel = require('../cards/model');
const transModel = require('../transactions/model');
const transSchema = require('../transactions/schema');

const operationsController = {
  async cardToMobile(ctx) {
    let trans = {
      cardId: ctx.params.id,
      type: 'toMobile',
      data: { phoneNumber: '9007771100' },
      sum: -ctx.request.body.amount,
    };
    trans = await transSchema.validate(trans);

    await cardModel.changeBalance(trans.cardId, trans.sum);
    ctx.body = await transModel.create(trans);
    ctx.status = 201;
  },

  async mobileToCard(ctx) {
    let trans = {
      cardId: ctx.params.id,
      type: 'fromMobile',
      data: { phoneNumber: '9007771100' },
      sum: ctx.request.body.amount,
    };
    trans = await transSchema.validate(trans);

    await cardModel.changeBalance(trans.cardId, trans.sum);
    ctx.body = await transModel.create(trans);
    ctx.status = 201;
  },

  async cardToCard(ctx) {
    const idFrom = await Joi.objectId().validate(ctx.params.id);
    const idTo = await Joi.objectId().validate(ctx.request.body.receiverCardId);
    const cardFrom = await cardModel.get(idFrom);
    const cardTo = await cardModel.get(idTo);

    let transFrom = {
      cardId: idFrom,
      type: 'toCard',
      data: { cardNumber: cardTo.cardNumber },
      sum: -ctx.request.body.amount,
    };
    let transTo = {
      cardId: idTo,
      type: 'fromCard',
      data: { cardNumber: cardFrom.cardNumber },
      sum: ctx.request.body.amount,
    };
    transFrom = await transSchema.validate(transFrom);
    transTo = await transSchema.validate(transTo);

    await cardModel.changeBalance(transFrom.cardId, transFrom.sum);
    await cardModel.changeBalance(transTo.cardId, transTo.sum);
    ctx.body = {
      from: await transModel.create(transFrom),
      to: await transModel.create(transTo),
    };
    ctx.status = 201;
  },
};

module.exports = operationsController;
