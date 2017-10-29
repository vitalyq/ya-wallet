// Connection pooling facility.
// Be warned, error handling is up to you.
const { MongoClient } = require('mongodb');

let dbCache;

// Retrieve cached Db instance.
const getDb = () => dbCache;

// Indexes to be created on connect.
// Keys are collection names, values are indexSpecs.
getDb.indexes = {};

// Connect to MongoDB and cache the Db instance.
getDb.connect = async (url, options) => {
  dbCache = await MongoClient.connect(url, options);

  // Create indexes if required.
  const indexPormises = Object.entries(getDb.indexes)
    .map(([key, value]) => (
      dbCache.collection(key).createIndexes(value)
    ));
  await Promise.all(indexPormises);

  return dbCache;
};

module.exports = getDb;
