const cardModel = require('./model');
const cardSchema = require('./schema');

const cardsController = {
  async getAll(ctx) {
    ctx.body = await cardModel.getAll();
  },

  async create(ctx) {
    let card = await cardSchema.card.validate(ctx.request.body);
    card = await cardModel.create(card);
    ctx.status = 201;
    ctx.body = card;
  },

  async delete(ctx) {
    const id = await cardSchema.cardId.validate(ctx.params.id);
    await cardModel.delete(id);
    ctx.status = 200;
  },
};

module.exports = cardsController;
