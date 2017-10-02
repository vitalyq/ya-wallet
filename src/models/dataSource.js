const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = (dataFile) => {
  const dataFilePath = path.join(__dirname, '..', 'data', dataFile);
  return {
    // Get data from the file
    async getData() {
      const cards = await readFile(dataFilePath);
      return JSON.parse(cards);
    },

    // Save data to the file
    async saveData(data) {
      await writeFile(
        dataFilePath,
        JSON.stringify(data, null, 2),
      );
    },

    // Generate ID
    getNextId(data) {
      let max = 0;
      data.forEach((item) => {
        if (item.id > max) {
          max = item.id;
        }
      });
      return max + 1;
    },
  };
};
