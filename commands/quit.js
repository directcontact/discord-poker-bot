const Database = require('better-sqlite3');
const path = require('path');
const Discord = require('discord.js');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));
const client = new Discord.Client();

module.exports = {
  name: '',
  description: '',
  execute(message, args) {
    if (queries.tableEntryExists(db, msg.author.username, PLAYERS)) {
      let playerID = queries.getID(db, msg.author.username, PLAYERS);
      queries.removeTableEntry(db, playerID, PLAYERS);
      msg.channel.send(`${msg.author.username} has left the table.`);
    } else {
      msg.channel.send('Youre not in the game.');
    }
  },
};
