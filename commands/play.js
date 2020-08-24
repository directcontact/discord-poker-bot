const Database = require('better-sqlite3');
const path = require('path');
const Discord = require('discord.js');

const queries = require('../src/db-queries');
const {
  PROFILES,
  PLAYERS,
  MAX_PLAYERS,
} = require('../constants/game-constants');

const db = new Database(path.resolve('data/poker.db'));
const client = new Discord.Client();

module.exports = {
  name: 'play',
  description: 'Allows the user to enter the lobby.',
  execute(message, args) {
    if (queries.tableEntryExists(db, message.author.username, PROFILES)) {
      let count = queries.getUserCount(db, PLAYERS);

      if (count === MAX_PLAYERS) {
        message.channel.send('The game is full');
      } else {
        if (queries.tableEntryExists(db, message.author.username, PLAYERS)) {
          message.channel.send('Youre already in');
        } else {
          queries.addTableEntry(db, message.author.username, PLAYERS);
          console.log(
            'Chips: ' + queries.getChips(db, message.author.username, PLAYERS)
          );
          message.channel.send(
            `(${count + 1}/${MAX_PLAYERS}) ${
              message.author.username
            } has joined!\nType !play to join!`
          );
        }
      }
    } else {
      message.channel.send('You dont have a profile');
    }
  },
};
