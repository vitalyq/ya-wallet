const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const serve = require('koa-static');
const db = require('./utils/db');
const config = require('./config');
const logger = require('./utils/logger');
const koaLogger = require('./utils/koaLogger');
const koaJoi = require('./utils/joi').middleware;
const setupClientRoute = require('./client/route-setup');
const operationsController = require('./operations/controller');
const cardsController = require('./cards/controller');
const transactionsController = require('./transactions/controller');

const app = new Koa();
const dbUrl = config.database.url;
const port = config.server.port;

// Routes
router.get('/state', operationsController.getState);
router.get('/cards', cardsController.getAll);
router.post('/cards', cardsController.create);
router.delete('/cards/:id', cardsController.delete);
router.post('/cards/:id/pay', operationsController.cardToMobile);
router.post('/cards/:id/fill', operationsController.mobileToCard);
router.post('/cards/:id/transfer', operationsController.cardToCard);
router.get('/transactions', transactionsController.getAll);

// Middlewares
app.use(koaLogger);
app.use(koaJoi);
app.use(bodyParser());
app.use(router.routes());
setupClientRoute(app);
app.use(serve('./dist'));

// Error listener
app.on('error', (err, ctx) => {
  if (err.expose) { return; }
  logger.error('Server error', err, ctx);
});

db.connect(dbUrl)
  .catch((err) => {
    logger.error('Database error', err.stack);
    process.exit(1);
  })
  .then(() => {
    app.listen(port, () => {
      logger.info(`Started on port ${port}!`);
    });
  });

// Export the app
module.exports = app;
