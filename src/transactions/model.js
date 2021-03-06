const db = require('../utils/db');

const transactions = () => db().collection('transactions');

const transactionModel = {
  async getAll() {
    return transactions().find().toArray();
  },

  async create(trans) {
    const r = await transactions().insertOne(trans);
    return r.ops[0];
  },
};

module.exports = transactionModel;
