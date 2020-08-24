const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'start',
  description: 'Begins the game, starts up and initializes all values.',
  execute(message, args, state) {
    message.channel.send('The game will start');
    state.status = true;
    queries.createPlayerTable(db);
    queries.createProfileTable(db);
  },
};
