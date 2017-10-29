const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const cardModel = require('./model');
const cardSchema = require('./schema');

const cardsController = {
  async getAll(ctx) {
    ctx.body = await cardModel.getAll();
  },

  async create(ctx) {
    const card = await cardSchema.validate(ctx.request.body);
    ctx.body = await cardModel.create(card);
    ctx.status = 201;
  },

  async delete(ctx) {
    const id = await Joi.objectId().validate(ctx.params.id);
    await cardModel.delete(id);
    ctx.status = 200;
  },
};

module.exports = cardsController;
