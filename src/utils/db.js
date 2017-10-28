// Connection pooling facility.
// Be warned, error handling is up to you.
const { MongoClient } = require('mongodb');

let dbCache;

const getDb = () => dbCache;
getDb.connect = async (url) => {
  dbCache = await MongoClient.connect(url);
  return dbCache;
};

module.exports = getDb;
