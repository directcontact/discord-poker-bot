const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const { PROFILES, PLAYERS } = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'id',
  description: 'Returns the current profile and player ids of the user.',
  execute(message, args) {
    console.log(
      'Profiles: ' + queries.getID(db, message.author.username, PROFILES)
    );
    console.log(
      'Players: ' + queries.getID(db, message.author.username, PLAYERS)
    );
  },
};
