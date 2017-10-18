const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const serve = require('koa-static');
const logger = require('./utils/logger');
const addClientRoute = require('./client/server-route');
const { getCards, createCard, deleteCard } = require('./cards/controller');
const { getTransactions, createTransaction } = require('./transactions/controller');
const { payForCell } = require('./operations/controller');

const app = new Koa();

// Set up routes
router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:id', deleteCard);
router.get('/cards/:id/transactions', getTransactions);
router.post('/cards/:id/transactions', createTransaction);
router.post('/cards/:id/pay', payForCell);

// Set up logging
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// Catch downstream errors
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error('Error detected', err);
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

// Set up middleware
app.use(bodyParser());
app.use(router.routes());
addClientRoute(app);
app.use(serve('./dist'));

app.listen(3000, () => {
  logger.info('Started, listening port 3000!');
});

// Export the app
module.exports = app;
