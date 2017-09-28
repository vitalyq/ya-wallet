const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const CARD_FILE = path.join(__dirname, '../../data/cards.json');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = {
  // Get data from the file
  async getData() {
    const cards = await readFile(CARD_FILE);
    return JSON.parse(cards);
  },

  // Save data to the file
  async saveData(data) {
    await writeFile(
      CARD_FILE,
      JSON.stringify(data, null, 2),
    );
  },
};
