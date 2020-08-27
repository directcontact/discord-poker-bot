const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const { PLAYERS } = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'quit',
  description: 'Quits the current game.',
  game: true,
  execute(message, args) {
    if (queries.tableEntryExists(db, message.author.username, PLAYERS)) {
      let playerID = queries.getID(db, message.author.username, PLAYERS);
      queries.removeTableEntry(db, playerID, PLAYERS);
      message.channel.send(`${message.author.username} has left the table.`);
    } else {
      message.channel.send('Youre not in the game.');
    }
  },
};
