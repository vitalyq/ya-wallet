const { checkCardNumber, checkCardId } = require('../../models/cards/validator');
const { getCards, createCard, deleteCard } = require('../../models/cards');

module.exports = {
  // Get list of all cards in JSON format
  async getCards(ctx) {
    ctx.body = await getCards();
  },

  // Add new card
  // Parses urlencoded or JSON body fields: cardNumber, balance
  async createCard(ctx) {
    let card = checkCardNumber(ctx.request.body);
    card = await createCard(card);
    ctx.status = 201;
    ctx.body = card;
  },

  // Delete card by ID
  async deleteCard(ctx) {
    const id = checkCardId(ctx.params.id);
    await deleteCard(id);
    ctx.status = 200;
  },
};
