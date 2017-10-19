// Koa logging middleware
const logger = require('./logger');

module.exports = async (ctx, next) => {
  const start = new Date();
  try {
    await next();
  } finally {
    const ms = new Date() - start;
    logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
  }
};
