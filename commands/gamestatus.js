const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const { PLAYERS, PROFILES } = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'gamestatus',
  description:
    'Shows the current status of the game with all the users, chips, and the current river.',
  game: true,
  execute(message, args, state) {
    if (message.author.id === state.master) {
    }
  },
};
