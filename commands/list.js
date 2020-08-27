const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'list',
  description: 'Lists all of the current profiles within the profiles table.',
  game: true,
  execute(message) {
    let profiles = queries.listRows(db, PROFILES);

    for (let i = 0; i < profiles.length; i++) {
      message.channel.send(i + 1 + '. ' + profiles[i]);
    }
  },
};
