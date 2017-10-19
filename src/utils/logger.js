const path = require('path');
const log4js = require('log4js');

const PROD = process.env.NODE_ENV === 'production';
const CATEGORY = 'wallet';
const LOG_PATH = path.join(__dirname, '..', '..', 'logs', 'app.log');

const config = {
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
      level: !PROD ? 'debug' : 'info',
    },
  },
};

// Set up logger
log4js.configure(config);
const logger = log4js.getLogger(CATEGORY);

module.exports = logger;
