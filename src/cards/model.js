const createError = require('http-errors');
const path = require('path');
const loader = require('../utils/dataLoader');

const data = loader(path.join(__dirname, 'data.json'));

const cardModel = {
  async getAll() {
    return data.get();
  },

  async get(id) {
    const cards = await data.get();
    const card = cards.find(c => c.id === id);
    if (!card) {
      throw createError(400, 'Card not found');
    }

    return card;
  },

  async create(card) {
    const cards = await data.get();
    const cardExists = cards.some(c => (
      c.cardNumber === card.cardNumber
    ));
    if (cardExists) {
      throw createError(400, 'Card already exists');
    }

    card.id = data.getNextId(cards);
    cards.push(card);
    await data.save(cards);

    return card;
  },

  async delete(id) {
    const cards = await data.get();
    const newCards = cards.filter(card => card.id !== id);

    if (cards.length === newCards.length) {
      throw createError(404, 'Card not found');
    }

    await data.save(newCards);
  },

  async changeBalance(id, delta) {
    const cards = await data.get();
    const card = cards.find(c => c.id === id);
    if (!card) {
      throw createError(400, 'Card not found');
    }

    // Handle float errors
    const newBalance = ((card.balance * 100) + (delta * 100)) / 100;
    if (newBalance < 0) {
      throw createError(400, 'Not enough funds');
    }

    card.balance = newBalance;
    await data.save(cards);
  },
};

module.exports = cardModel;
