const luhn = require('../../vendor/luhn-algorithm');
const { getData, saveData } = require('./dataSource');
const koaError = require('../../utils/koaError');

// Validate card with Luhn algorithm
const isCardValid = cardNumber => luhn(cardNumber);

module.exports = {
  async getCards() {
    return getData();
  },

  async createCard(card) {
    if (!card ||
      !isCardValid(card.cardNumber) ||
      isNaN(card.balance)) {
      throw koaError(400);
    }
    card.balance = Number(card.balance);

    const cards = await getData();
    const cardExists = cards.some(c => (
      c.cardNumber === card.cardNumber
    ));
    if (cardExists) {
      throw koaError(400, 'Card exists');
    }

    cards.push(card);
    await saveData(cards);

    return card;
  },

  async deleteCard(cardId) {
    const id = Number(cardId);
    if (isNaN(id)) {
      throw koaError(400);
    }

    const cards = await getData();
    if (!cards[id]) {
      throw koaError(404, 'Card not found');
    }
    const newCards = cards.filter((card, i) => i !== id);

    await saveData(newCards);
  },
};
