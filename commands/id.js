const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: '',
  description: '',
  execute(message, args) {
    console.log(
      'Profiles: ' + queries.getID(db, message.author.username, PROFILES)
    );
    console.log(
      'Players: ' + queries.getID(db, message.author.username, PLAYERS)
    );
  },
};
