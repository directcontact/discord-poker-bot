const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'end',
  description: 'Ends the game.',
  execute(message, args, state) {
    state.status = false;
    queries.deleteTable(db, 'players');
    message.channel.send('Game has ended');
  },
};
