const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const serve = require('koa-static');
const { getCards, createCard, deleteCard } = require('./controllers/cards');
const handleError = require('./controllers/error');

const app = new Koa();

// Set up routes
router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:id', deleteCard);
router.all('/error', handleError);

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
