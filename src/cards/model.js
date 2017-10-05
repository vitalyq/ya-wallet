const path = require('path');
const loader = require('../utils/dataLoader');
const koaError = require('../utils/koaError');

const { getData, saveData, getNextId } = loader(path.join(__dirname, 'data.json'));

module.exports = {
  async getCards() {
    return getData();
  },

  async createCard(card) {
    const cards = await getData();
    const cardExists = cards.some(c => (
      c.cardNumber === card.cardNumber
    ));
    if (cardExists) {
      throw koaError(400, 'Card exists');
    }

    card.id = getNextId(cards);
    cards.push(card);
    await saveData(cards);

    return card;
  },

  async deleteCard(id) {
    const cards = await getData();
    const newCards = cards.filter(card => card.id !== id);

    if (cards.length === newCards.length) {
      throw koaError(404, 'Card not found');
    }

    await saveData(newCards);
  },
};
