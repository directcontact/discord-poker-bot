const Database = require('better-sqlite3');
const path = require('path');
const Discord = require('discord.js');

const queries = require('../src/db-queries');

const db = new Database(path.resolve('data/poker.db'));
const client = new Discord.Client();

module.exports = {
  name: 'add',
  description: 'Adds chips to the user',
  execute(message, args) {
    let exists = queries.tableEntryExists(db, msg.author.username, 'profiles');
    if (exists) {
      queries.setChips(db, msg.author.username, value, 'profiles');
      msg.channel.send(`Added ${value} chips to your account!`);
    } else {
      msg.channel.send('You do not have a profile yet!');
    }
  },
};
