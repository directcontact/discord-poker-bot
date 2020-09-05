const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const { PROFILES } = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'bank',
  description: 'Returns your chips that are currently stored in the bank.',
  game: false,
  execute(message) {
    if (queries.tableEntryExists(db, message.author.id, PROFILES)) {
      let chips = queries.getChips(db, message.author.id, PROFILES);
      message.reply(`You have ${chips} chips in the bank!`);
    } else {
      message.send('You dont have a profile yet.');
    }
  },
};
