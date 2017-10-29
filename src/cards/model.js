const createError = require('http-errors');
const ObjectID = require('mongodb').ObjectID;
const db = require('../utils/db');

// Define indexes for the collection
db.indexes.cards = [{
  key: { cardNumber: 1 },
  unique: true,
}];
const cards = () => db().collection('cards');

const cardModel = {
  async getAll() {
    return cards().find().toArray();
  },

  async get(id) {
    const card = await cards().findOne({ _id: new ObjectID(id) });
    if (!card) {
      throw createError(400, 'Card not found');
    }

    return card;
  },

  async create(card) {
    try {
      const r = await cards().insertOne(card);
      return r.ops[0];
    } catch (err) {
      throw err.code === 11000 ?
        createError(400, 'Card already exists') :
        err;
    }
  },

  async delete(id) {
    const r = await cards().deleteOne({ _id: new ObjectID(id) });
    if (!r.deletedCount) {
      throw createError(404, 'Card not found');
    }
  },

  async changeBalance(id, delta) {
    const minBalance = delta < 0 ? Math.abs(delta) : 0;
    const r = await cards().updateOne({
      _id: new ObjectID(id),
      balance: { $gte: minBalance },
    }, {
      $inc: { balance: delta },
    });
    if (!r.modifiedCount) {
      throw createError(400, 'Card not found or not enough funds');
    }
  },
};

module.exports = cardModel;
