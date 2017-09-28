const express = require('express');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const wrap = require('../utils/wrap');
const luhn = require('../utils/luhn-algorithm');

const CARDS_FILE = path.join(__dirname, '../data/cards.json');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const router = express.Router();

// Get cards from the file
const getCards = async () => {
  try {
    const cards = await readFile(CARDS_FILE);
    return JSON.parse(cards);
  } catch (error) {
    console.error('Error while reading cards');
    throw error;
  }
};

// Save cards to the file
const saveCards = async (cards) => {
  try {
    await writeFile(
      CARDS_FILE,
      JSON.stringify(cards, null, 2),
    );
  } catch (error) {
    console.error('Error while writing cards');
    throw error;
  }
};

// Validate card with Luhn algorithm
const isCardValid = cardNumber => luhn(cardNumber);

// Get list of all cards in JSON format
router.get('/', wrap(async (req, res) => {
  res.json(await getCards());
}));

// Add new card
// Parses urlencoded or JSON body fields: cardNumber, balance
router.post('/', wrap(async (req, res) => {
  const { cardNumber, balance } = req.body;
  if (!isCardValid(cardNumber)) {
    return res.status(400).send('Bad request');
  }

  const card = { cardNumber };
  if (!isNaN(balance)) {
    card.balance = Number(balance);
  }

  const cards = await getCards();
  const cardExists = cards.some(card => card.cardNumber === cardNumber);
  if (cardExists) {
    return res.status(400).send('Card exists');
  }
  cards.push(card);

  await saveCards(cards);
  res.json(card);
}));

// Delete card by ID
router.delete('/:id', wrap(async (req, res) => {
  const cardId = Number(req.params.id);
  if (isNaN(cardId)) {
    return res.status(400).send('Bad request');
  }

  const cards = await getCards();
  if (!cards[cardId]) {
    return res.status(404).send('Card not found');
  }
  const newCards = cards.filter((card, i) => i !== cardId);

  await saveCards(newCards);
  res.send('OK');
}));

module.exports = router;
