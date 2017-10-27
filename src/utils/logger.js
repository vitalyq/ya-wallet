const path = require('path');
const log4js = require('log4js');
const config = require('../config');

const LOG_PATH = path.join(__dirname, '..', '..', 'logs', 'app.log');
const CATEGORY = 'wallet';

const options = {
  appenders: {
    out: { type: 'stdout' },
    app: {
      type: 'file',
      filename: LOG_PATH,
      maxLogSize: 10485760,
    },
  },
  categories: {
    default: {
      appenders: ['out', 'app'],
      level: config.logger.level,
    },
  },
};

// Set up logger
log4js.configure(options);
const logger = log4js.getLogger(CATEGORY);

module.exports = logger;
