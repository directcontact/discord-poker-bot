const Database = require('better-sqlite3');
const path = require('path');

const queries = require('../src/db-queries');
const {
  PROFILES,
  PLAYERS,
  MAX_PLAYERS,
} = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));

module.exports = {
  name: 'play',
  description: 'Allows the user to enter the lobby.',
  game: true,
  execute(message, args, state) {
    // Check if the profile for the user exists
    if (queries.tableEntryExists(db, message.author.username, PROFILES)) {
      let count = queries.getUserCount(db, PLAYERS);

      // Check if the count is at max player capacity.
      if (count === MAX_PLAYERS) {
        message.channel.send('The game is full');
        // Otherwise, check if the profile is a player, or add them to the game.
      } else {
        if (queries.tableEntryExists(db, message.author.username, PLAYERS)) {
          message.channel.send('Youre already in');
        } else {
          queries.addTableEntry(db, message.author.username, PLAYERS);
          message.channel.send(
            `(${count + 1}/${MAX_PLAYERS}) ${
              message.author.username
            } has joined!\nType !play to join!`
          );
        }
      }
      // Check if the player is the first to join, if so, make them the game master.
      if (count === 0) {
        state.master = message.author.id;
      }
      // If the profile doesn't exist, let the user know that it doesn't exist.
    } else {
      message.channel.send('You dont have a profile');
    }
  },
};
