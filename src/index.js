const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const serve = require('koa-static');
const logger = require('./utils/logger');
const koaLogger = require('./utils/koaLogger');
const setupClientRoute = require('./client/route-setup');
const cardsController = require('./cards/controller');
const transactionsController = require('./transactions/controller');
const operationsController = require('./operations/controller');

const app = new Koa();

// Routes
router.get('/cards', cardsController.getAll);
router.post('/cards', cardsController.create);
router.delete('/cards/:id', cardsController.delete);
router.get('/cards/:id/transactions', transactionsController.getAll);
router.post('/cards/:id/pay', operationsController.cardToMobile);
router.post('/cards/:id/fill', operationsController.mobileToCard);
router.post('/cards/:id/transfer', operationsController.cardToCard);

// Middlewares
app.use(koaLogger);
app.use(bodyParser());
app.use(router.routes());
setupClientRoute(app);
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
