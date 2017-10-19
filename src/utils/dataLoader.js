const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

module.exports = dataFile => ({
  // Get data from the file
  async get() {
    const data = await readFile(dataFile);
    return JSON.parse(data);
  },

  // Save data to the file
  async save(data) {
    await writeFile(
      dataFile,
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
});
