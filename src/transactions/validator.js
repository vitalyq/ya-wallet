const createError = require('http-errors');

const allowedTypes = [
  'paymentMobile',
  'prepaidCard',
  'card2Card',
];

module.exports = {
  checkTransaction(trans) {
    if (typeof trans !== 'object' ||
      isNaN(trans.cardId) ||
      !allowedTypes.includes(trans.type)) {
      throw createError(400);
    }
    trans.cardId = Number(trans.cardId);
    return trans;
  },
};
