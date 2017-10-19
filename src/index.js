const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const serve = require('koa-static');
const logger = require('./utils/logger');
const koaLogger = require('./utils/koaLogger');
const addClientRoute = require('./client/server-route');
const { getCards, createCard, deleteCard } = require('./cards/controller');
const { getTransactions, createTransaction } = require('./transactions/controller');
const { payForCell } = require('./operations/controller');

const app = new Koa();

// Routes
router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:id', deleteCard);
router.get('/cards/:id/transactions', getTransactions);
router.post('/cards/:id/transactions', createTransaction);
router.post('/cards/:id/pay', payForCell);

// Middlewares
app.use(koaLogger);
app.use(bodyParser());
app.use(router.routes());
addClientRoute(app);
app.use(serve('./dist'));

// Error listener
app.on('error', (err, ctx) => {
  if (err.expose) { return; }
  logger.error('Server error', err, ctx);
});

app.listen(3000, () => {
  logger.info('Started, listening port 3000!');
});

// Export the app
module.exports = app;
