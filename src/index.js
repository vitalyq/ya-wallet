const express = require('express');
const bodyParser = require('body-parser');
const cards = require('./controllers/cards');

const app = express();

// Application-level middleware
// - parse application/json
// - parse application/x-www-form-urlencoded
// - serve static files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/cards', cards);
app.get('/error', () => {
  throw Error('Oops!');
});

// Error-handling middleware
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log('YM Node School App listening on port 3000!');
});

// Export the app
module.exports = app;
