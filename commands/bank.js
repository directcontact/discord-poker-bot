const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: '',
  description: '',
  execute(message) {
    if (queries.tableEntryExists(db, msg.author.username, PROFILES)) {
      let chips = queries.getChips(db, msg.author.username, PROFILES);
      message.reply(`You have ${chips} chips in the bank!`);
    } else {
      message.send('You dont have a profile yet.');
    }
  },
};
