const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const { PLAYERS } = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'chips',
  description: 'Returns the number of chips held by the user.',
  game: true,
  execute(message) {
    let chips = queries.getChips(db, message.author.username, PLAYERS);
    message.reply(`You have ${chips} chips!`);
  },
};
