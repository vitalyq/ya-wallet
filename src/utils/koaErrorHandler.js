// Koa error handling middleware
const logger = require('./logger');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error('Error detected', err);
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};
