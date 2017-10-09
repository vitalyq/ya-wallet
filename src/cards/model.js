const path = require('path');
const loader = require('../utils/dataLoader');
const koaError = require('../utils/koaError');

const { getData, saveData, getNextId } = loader(path.join(__dirname, 'data.json'));

module.exports = {
  async getCards() {
    return getData();
  },

  async getCard(id) {
    const cards = await getData();
    const card = cards.find(c => c.id === id);
    if (!card) {
      throw koaError(400, 'Card not found');
    }

    return card;
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

  async chargeCard(id, amount) {
    const cards = await getData();
    const card = cards.find(c => c.id === id);
    if (!card) {
      throw koaError(400, 'Card not found');
    }

    const newBalance = card.balance - amount;
    if (newBalance < 0) {
      throw koaError(400, 'Not enough funds');
    }

    card.balance = newBalance;
    await saveData(cards);
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
