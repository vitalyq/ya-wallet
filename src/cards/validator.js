const createError = require('http-errors');
const luhn = require('../vendor/luhn-algorithm');

module.exports = {
  checkCardNumber(card) {
    if (typeof card !== 'object' ||
      !luhn(card.cardNumber) ||
      isNaN(card.balance)) {
      throw createError(400);
    }
    card.balance = Number(card.balance);
    return card;
  },

  checkCardId(id) {
    if (isNaN(id)) {
      throw createError(400);
    }
    return Number(id);
  },
};
