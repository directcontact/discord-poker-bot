const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const { PROFILES, PLAYERS } = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'clear',
  description: 'Clears all the table entries and tables.',
  game: false,
  execute(message, args) {
    queries.deleteTable(db, PROFILES);
    queries.deleteTable(db, PLAYERS);
    message.channel.send('Cleared all the tables!');
  },
};
