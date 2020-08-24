const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const { PLAYERS } = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'end',
  description: 'Ends the game.',
  execute(message, args, state) {
    state.status = false;
    queries.deleteTable(db, PLAYERS);
    message.channel.send('Game has ended');
  },
};
