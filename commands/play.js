const Database = require('better-sqlite3');
const path = require('path');
const Discord = require('discord.js');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));
const client = new Discord.Client();

module.exports = {
  name: 'play',
  description: 'Allows the user to enter the lobby.',
  execute(message, args) {
    if (gameState.status === true) {
      if (tableEntryExists(db, msg.author.username, PROFILES)) {
        let count = queries.getUserCount(db, 'players');

        if (count === MAX_PLAYERS) {
          msg.channel.send('The game is full');
        } else {
          if (queries.tableEntryExists(db, msg.author.username, 'players')) {
            msg.channel.send('Youre already in');
          } else {
            queries.addTableEntry(db, msg.author.username, PLAYERS);
            console.log(
              'Chips: ' + queries.getChips(db, msg.author.username, PLAYERS)
            );
            msg.channel.send(
              `(${count + 1}/${MAX_PLAYERS}) ${
                msg.author.username
              } has joined!\nType !play to join!`
            );
          }
        }
      } else {
        msg.channel.send('You dont have a profile');
      }
    } else if (gameState.status === false) {
      msg.channel.send('A game hasnt started stupid');
    }
  },
};
