const { getData, saveData, getNextId } = require('../dataSource')('transactions.json');
const koaError = require('../../utils/koaError');

module.exports = {
  async getTransactions(cardId) {
    const transactions = await getData();
    return transactions.filter(t => t.cardId === cardId);
  },

  async createTransaction(trans) {
    const transactions = await getData();

    trans.id = getNextId(transactions);
    transactions.push(trans);
    await saveData(transactions);

    return trans;
  },

  deleteTransaction() {
    throw koaError(400, 'Impossible to delete transaction');
  },
};
