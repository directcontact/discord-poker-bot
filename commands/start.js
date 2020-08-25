const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'start',
  description: 'Begins the game, starts up and initializes all values.',
  game: false,
  execute(message, args, state) {
    if (state.status) {
      message.channel.send('The game has already started')
    }
    else {
    message.channel.send('The game will start');
    state.status = true;
    queries.createPlayerTable(db);
    queries.createProfileTable(db);
    }
  },
};
