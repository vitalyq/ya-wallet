const { getCards, createCard, deleteCard } = require('../../models/cards');

module.exports = {
  // Get list of all cards in JSON format
  async getCards(ctx) {
    ctx.body = await getCards();
  },

  // Add new card
  // Parses urlencoded or JSON body fields: cardNumber, balance
  async createCard(ctx) {
    const card = await createCard(ctx.request.body);
    ctx.status = 201;
    ctx.body = card;
  },

  // Delete card by ID
  async deleteCard(ctx) {
    await deleteCard(ctx.params.id);
    ctx.status = 200;
  },
};
