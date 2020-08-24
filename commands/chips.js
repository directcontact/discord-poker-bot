const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: '',
  description: '',
  execute(message, args) {
    let chips = queries.getChips(db, msg.author.username, PLAYERS);
    message.reply(`You have ${chips} chips!`);
  },
};
