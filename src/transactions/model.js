const path = require('path');
const loader = require('../utils/dataLoader');

const data = loader(path.join(__dirname, 'data.json'));

const transactionModel = {
  async getAll(cardId) {
    const transactions = await data.get();
    return transactions.filter(t => t.cardId === cardId);
  },

  async create(trans) {
    const transactions = await data.get();

    trans.id = data.getNextId(transactions);
    transactions.push(trans);
    await data.save(transactions);

    return trans;
  },
};

module.exports = transactionModel;
