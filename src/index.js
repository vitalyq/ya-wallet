const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const serve = require('koa-static');
const { getCards, createCard, deleteCard } = require('./cards/controller');
const { getTransactions, createTransaction } = require('./transactions/controller');

const app = new Koa();

// Set up routes
router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:id', deleteCard);
router.get('/cards/:id/transactions', getTransactions);
router.post('/cards/:id/transactions', createTransaction);

// Catch downstream errors
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

// Set up middleware
app.use(logger());
app.use(bodyParser());
app.use(router.routes());
app.use(serve('./public'));

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

// Export the app
module.exports = app;
