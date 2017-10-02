const luhn = require('../../vendor/luhn-algorithm');
const koaError = require('../../utils/koaError');

module.exports = {
  checkCardNumber(card) {
    if (typeof card !== 'object' ||
      !luhn(card.cardNumber) ||
      isNaN(card.balance)) {
      throw koaError(400);
    }
    card.balance = Number(card.balance);
    return card;
  },

  checkCardId(id) {
    if (isNaN(id)) {
      throw koaError(400);
    }
    return Number(id);
  },
};
